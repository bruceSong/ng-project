/**
 *  监听src目录下文件变化
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var fecs = require('fecs-gulp');
var config = require('./config');
var basePath = config.path.src;

//JS检测任务
gulp.task('jshint', ['concatHtml2Js'], function () {
    var src = [
        basePath + '/page/*/*.js',
        basePath + '/page/*/*/*.js'
    ];
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});