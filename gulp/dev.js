/**
 * 开发调试临时文件清除
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('./config');
var buildPath = config.path.build;

var cssSrc = Object.keys(config.path.js).map(function(v, i) {
    return buildPath + '/' + v + '*.css';
});
cssSrc.push(buildPath + '/common*.js.css');

// 清除webpack生成的中间文件
// 依赖构建的最后一个任务
gulp.task('devClear', ['jshint'], function() {
    gulp.run('reload');
    var all = [buildPath + '/page'];
    return gulp.src(all.concat(cssSrc)).pipe(clean());
});
