var gulp        = require('gulp');
var gutil       = require('gulp-util');
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');
var prefix      = require('gulp-autoprefixer');
var livereload  = require('gulp-livereload');
var cssshrink   = require('gulp-cssshrink');
var sass        = require('gulp-sass');

var settings = require('../settings');

var noServer = process.argv.indexOf('--noserver') > -1;

// generate styles
gulp.task('style', function() {
  return gulp.src(settings.SRC +'/style/*.scss')
    .pipe(plumber())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(prefix())
    // .pipe(cssshrink())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(settings.DEST + settings.CSS_URL))

    .pipe(noServer? gutil.noop() : livereload())
});