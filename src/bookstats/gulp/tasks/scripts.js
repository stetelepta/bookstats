var gulp        = require('gulp');
var gutil       = require('gulp-util');
var plumber     = require('gulp-plumber');
var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var prefix      = require('gulp-autoprefixer');
var livereload  = require('gulp-livereload');

var settings = require('../settings');

var noServer = process.argv.indexOf('--noserver') > -1;

// generate styles
gulp.task('script', function(){
  return gulp.src(settings.SRC +'/scripts/**/*.js')
    .pipe(plumber()) 
    .pipe(browserify({ noParse: "node_modules/mixing/index.js"}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(settings.DEST + settings.JS_URL))
    .pipe(noServer? gutil.noop() : livereload())
});