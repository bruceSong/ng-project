/**
 *  本地服务模块
 */

var gulp = require('gulp');
var url = require('url');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync').create();

var config = require('./config');
var rewriteConf = require('../proxy.json');

// start server
gulp.task('server', function() {
    var proxies = [];
    rewriteConf.proxies.forEach(function(item) {
        var paths = item.path.match(/^\/\(([^\(\)]+)\)$/);
        if (paths) {
            paths = paths[1].split('|');
            paths.forEach(function(items) {
                var proxyOptions = url.parse('http://' + item.proxy + '/' + items);
                proxyOptions.route = '/' + items;
                proxies.push(proxy(proxyOptions));
            });
        } else {
            var proxyOptions = url.parse('http://' + item.proxy + item.path);
            proxyOptions.route = item.path;
            proxies.push(proxy(proxyOptions));
        }
    });
	browserSync.init({
		server: {
			baseDir: config.path.build,
            middleware: proxies
		},
		port: 8080
	});
});

gulp.task('reload', function() {
    browserSync.reload();
});
