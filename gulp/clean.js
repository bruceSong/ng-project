/**
 *  清除build目录
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('./config');

gulp.task('clean', function() {
	gulp.src(config.path.build).pipe(clean());
});
