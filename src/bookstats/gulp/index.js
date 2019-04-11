// settings
var settings = require('./settings');

// gulp
var gulp        = require('gulp');
var livereload  = require('gulp-livereload');

// require directory of files
require('require-dir')('./tasks');

// watch
gulp.task('watch', function(){
  var server = livereload();
  gulp.watch(settings.SRC +'style/*.scss', ['style']);
  gulp.watch(settings.SRC +'scripts/**/*.js', ['script']);
});

gulp.task("default", ["watch"]);
