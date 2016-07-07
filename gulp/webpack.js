/**
 * 
 */

var gulp = require('gulp');
var webpack = require('webpack');
var $ = require('gulp-load-plugins')();
var config = require('./config');

var param = process.argv.slice(2);
var webpackMap = {
	dev: './webpack.config.js',
	build: './webpack.build.js'
};
var webpackConfig = webpackMap[param];
webpackConfig = webpackConfig || './webpack.config.js';

gulp.task('webpack', function() {
    return gulp.src(config.path.src + '/**')
        .pipe($.webpack(require(webpackConfig), webpack))
        .pipe(gulp.dest(config.path.build));
});

