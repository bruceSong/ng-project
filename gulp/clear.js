/**
 *  监听src目录下文件变化
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('./config');
var buildPath = config.path.build;

var cssSrc = Object.keys(config.path.js).map(function(v, i) {
    return buildPath + '/' + v + '*.css';
});
cssSrc.push(buildPath + '/common*.js.css');
cssSrc.push(buildPath + '/common.css');

var jsSrc = Object.keys(config.path.js).map(function(v, i) {
    return buildPath + '/js/' + v + '.js';
});
jsSrc.push(buildPath + '/common.js');
jsSrc.push(buildPath + '/js/app.js');
jsSrc.push(buildPath + '/js/vendors.js');

// 清除webpack生成的中间文件
// 依赖构建的最后一个任务
gulp.task('clear', ['co:setp:three'], function() {
    var all = [buildPath + '/page', buildPath + '/rev'];
    return gulp.src(all.concat(cssSrc).concat(jsSrc)).pipe(clean());
});
