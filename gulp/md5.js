/**
 *  添加md5戳
 */

var gulp = require('gulp');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector');
var config = require('./config');
var buildPath = config.path.build;

var src = Object.keys(config.path.js).map(function(v, i) {
    return buildPath + '/js/' + v + '.js';
});

gulp.task('md5:step:one', ['concatCss2Js'], function() {
    return gulp.src([buildPath + '/*.css', buildPath + '/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(buildPath))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildPath + '/rev/'));
});

gulp.task('co:setp:one', ['md5:step:one'], function() {
    return gulp.src([buildPath + '/rev/*.json', buildPath + '/*.html', buildPath + '/*.jsp'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest(buildPath));
});

gulp.task('md5:step:two', ['co:setp:one'], function() {
    src.push(buildPath + '/js/vendors.js');
    return gulp.src(src)
        .pipe(rev())
        .pipe(gulp.dest(buildPath + '/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildPath + '/rev/'));
});

gulp.task('co:setp:two', ['md5:step:two'], function() {
    return gulp.src([buildPath + '/rev/*.json', buildPath + '/*.html', buildPath + '/*.jsp'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest(buildPath));
});

gulp.task('md5:step:three', ['asynchash'], function() {
    return gulp.src([buildPath + '/js/app.js'])
        .pipe(rev())
        .pipe(gulp.dest(buildPath + '/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildPath + '/rev/'));
});

gulp.task('co:setp:three', ['md5:step:three'], function() {
    return gulp.src([buildPath + '/rev/*.json', buildPath + '/*.html', buildPath + '/*.jsp'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest(buildPath));
});