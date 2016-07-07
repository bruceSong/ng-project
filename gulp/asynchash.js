/**
 * 为异步脚本映射关系添加hash
 */
var gulp = require('gulp');
var asynchash = require('./asynchash.plugin.js');
var config = require('./config');

gulp.task('asynchash', ['co:setp:two'], function() {
	return gulp.src(config.path.build + '/js/app*.js')
		.pipe(asynchash(config))
		.pipe(gulp.dest(config.path.build + '/js'));
});