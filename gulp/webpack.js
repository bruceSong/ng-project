/**
 * 
 */

var gulp = require('gulp');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var $ = require('gulp-load-plugins')();
var config = require('./config');
var extend = require('./extend');

var param = process.argv.slice(2);
var webpackMap = {
	dev: './webpack.config.js',
	build: './webpack.build.js'
};
var configFile = webpackMap[param];
configFile = configFile || './webpack.config.js';
var webpackConfig = require(configFile);
var allEntry = extend({}, webpackConfig.entry);
var plugins = [];
webpackConfig.plugins.forEach(function(plugin) {
    if (!(plugin instanceof HtmlWebpackPlugin)) {
        plugins.push(plugin);
    }
});


gulp.task('webpack', function() {
    if (global.writeFilePath) {
        if (global.writeFilePath.indexOf('page') !== -1) {
            var entry = {};
            for (var key in allEntry) {
                if (global.writeFilePath.indexOf(key) !== -1) {
                    entry[key] = allEntry[key];
                }
            }
            webpackConfig.entry = entry;
        } else {
            webpackConfig.entry = {
                app: allEntry.app
            };
        }
        webpackConfig.plugins = plugins;
    }
    return gulp.src(config.path.src + '/**')
        .pipe($.webpack(webpackConfig, webpack))
        .pipe(gulp.dest(config.path.build));
});