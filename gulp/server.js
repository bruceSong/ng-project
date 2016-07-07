/**
 *  本地服务模块
 */

var gulp = require('gulp');
var config = require('./config');
var browserSync = require('browser-sync').create();

// start server
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: config.path.build
		},
		port: 8080
	});
});
