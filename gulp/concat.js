/**
 * webpack初始构建后，必要文件的合并及多余文件的清除
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var rwFile = require('./rwfile.plugin.js');
var concatHtml2Js = require('./concatHtml2Js.plugin.js');
var concatCss2Js = require('./concatCss2Js.plugin.js');

var config = require('./config');

var src = Object.keys(config.path.js).map(function(v, i) {
	return config.path.build + '/' + v + '*.css';
});

// 合并webpack每个chunk生成的样式表
gulp.task('concat', ['webpack'], function() {
    var files = [config.path.build + '/common.css'];
    return gulp.src(files.concat(src))
        .pipe(concat('common.css'))
        .pipe(gulp.dest(config.path.build));
});

// 从index.html中移除common.js.css的引用
gulp.task('rmLinkCommonJsCss', ['concat'], function() {
    var patterns = [];
    patterns.push({
        pattern: new RegExp('<link([^<>])*href="common.js.css"([^<>])*>'),
        value: ''
    });
    return gulp.src(config.path.build + '/index.html')
               .pipe(rwFile(patterns))
               .pipe(gulp.dest(config.path.build));
});

// 把*.html.js合并到对应该js入口文件的包里
gulp.task('concatHtml2Js', ['webpack'], function() {
    var src = [
        config.path.build + '/page/*/*.html.js',
        config.path.build + '/page/*/*/*.html.js'
    ];
    return gulp.src(src)
               .pipe(concatHtml2Js(config));
});

// 把css合并到js
gulp.task('concatCss2Js', ['concatHtml2Js'], function() {
    gulp.src(src)
        .pipe(concatCss2Js(config));
});