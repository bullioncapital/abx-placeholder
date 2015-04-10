var path = require('path');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var del = require('del');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

/**
 * Development Tasks
 */

gulp.task('connect', function() {
  $.connect.server({
    root: __dirname,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('index.html')
    .pipe($.connect.reload());
});

gulp.task('scss', function () {
  return gulp.src('scss/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({errLogToConsole: true}))
    .pipe($.autoprefixer({
      browsers: ["last 2 versions", "> 1%", "ie 8", "ie 7"],
      cascade: false
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .on('error', $.util.log)
  ;
});

gulp.task('images', function(cb) {
  return gulp.src(['img/**/*.png','img/**/*.jpg','img/**/*.gif','img/**/*.jpeg'])
    .pipe($.imageOptimization({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'))
    .on('error', $.util.log);
});

gulp.task('js', function(){
  var js =  gulp.src('js/*.js')
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .on('error', $.util.log);

  var modernizer = gulp.src(['index.html', 'js/*.js', 'dist/css/*.css']) 
    .pipe($.modernizr({
      "options" : [
        "setClasses",
        "addTest",
        "html5printshiv",
        "testProp",
        "fnBind"
      ],
      "tests" : [
        'transforms'
      ],
    }))
    .pipe(gulp.dest('dist/js'))
    .on('error', $.util.log);

  return merge(js, modernizer);
});

gulp.task('vendor', function(){
  var css = gulp.src('vendor/**/*.css')
    .pipe($.rename('vendor.min.css'))
    .pipe(gulp.dest('dist/css'))
    .on('error', $.util.log);

  var shiv = gulp.src('vendor/html5-3.6-respond-1.4.2.min.js')
    .pipe($.rename('shiv.js'))
    .pipe(gulp.dest('dist/'))
    .on('error', $.util.log);

  return merge(css, shiv);
});


gulp.task('watch', function () {
  gulp.watch(['js/**/*'], ['js']);
  gulp.watch(['scss/**/*'], ['scss']);
  gulp.watch(['index.html', 'dist/**/*'], ['html']);
});

/**
 * Deployment tasks
 */

gulp.task('build', ['clean'], function(cb){
  runSequence(
    'vendor',
    'scss',
    'js',
    'images',
    cb
  );
});

gulp.task('package', ['build'], function () {
  var minifyHtmlOps = {
    conditionals: true,
  };

  return gulp.src('index.html')
    .pipe($.inlineSource())
    .pipe($.inlineBase64({
        baseDir: __dirname,
        maxSize: 14 * 1024,
        debug: true
    }))
    .pipe($.minifyHtml(minifyHtmlOps))
    .pipe(gulp.dest('dist/'))
    .pipe($.filesize())
  ;
});

gulp.task('deploy', ['package'], function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});


/**
 * Default Task
 */
gulp.task('default', ['clean', 'build'], function(cb){
  runSequence(
    'connect',
    'watch'
  );
});
