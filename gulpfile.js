var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var autoprefixer = require('autoprefixer-core');

    return gulp.src('./_site/precompiled/*.css')
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
        .pipe(gulp.dest('./stylesheets/'));
});

gulp.task('minify-css', function() {
    gulp.task('minify-css', function() {
      return gulp.src('./_site/precompiled/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./stylesheets/'));
    });
});

gulp.task('default', function() {
    var postcss      = require('gulp-postcss');
    var autoprefixer = require('autoprefixer-core');

    return gulp.src('./_site/precompiled/*.css')
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
        .pipe(gulp.dest('./stylesheets/'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./stylesheets/'));
});
