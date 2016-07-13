/**
 * js语法检测
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var config = require('./config');
var basePath = config.path.src;

gulp.task('jshint', ['concatCss2Js'], function () {
    var src = [
        basePath + '/page/*/*.js',
        basePath + '/page/*/*/*.js'
    ];
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});