var gulp = require('gulp');
var path = require('path');
const through = require('through2');
const watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var mockerLoader = require('./dev-lib/mocker-loader');
var plumber = require('gulp-plumber');
var entrySink = require('./dev-lib/entry-sink');
var through2 = require('through2');
var webpack = require('webpack-stream');
var debug = require('gulp-debug');
var eh = require('./dev-lib/entry-holder');


const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const entryjs = "app.js";

// var sass = require('gulp-sass');

gulp.task('runBs', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      routes: {
        "/b": "bower_components"
      }
      // ,
      // index: "mithril.html",
      // middleware: [require('./middleware/append2body')]
    }
  }, function(err, bs) {
    bs.addMiddleware('', mockerLoader("mocks", entryjs), {
      override: true
    });
  });
});

gulp.task('stopBs', function() {
  browserSync.exit();
});

gulp.task('afterJsChange', function() {
  gulp.src(['./dev-js/t.js'])
    .pipe(plumber())
    // .pipe(debug({title: "before-babel:"}))
    .pipe(babel())
    .pipe(webpack())
    // .pipe(concat(entryjs))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    // .pipe(gulp.dest('dist'));
    .pipe(entrySink(entryjs))
    .pipe(through2.obj(function(file, enc, cb) {
      cb(null, file);
    }, function(cb) {
      browserSync.reload();
      cb();
    }));
});

gulp.task('watch', function() {
  gulp.watch(["./*.html", "./dev-js/*.js"], ["afterJsChange"]);
  gulp.watch(["./dev-lib/*.js", "./mocks/*.js"], ["stopBs", "runBs", "afterJsChange"]);
});

gulp.task('cc', function() {
  return gulp.src("js/*.js")
    // .pipe(watch("js/*.js"))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build/'));
});

// gulp-watch has problems.
// Static Server + watching scss/html files
// gulp.task('serve', /*['sass'],*/ function() {
gulp.task('serve', ['runBs', 'watch', 'afterJsChange'], function(cb) {
  console.log("started");
  cb();
  // return gulp.src('js/*.js')
  //         .pipe(gulp.dest('dist'))
  //         .pipe(through.obj(function(file, enc, cb){
  //           console.log('reach...........');
  //           cb(null, file);
  //         }));

  // gulp.watch("app/scss/*.scss", ['sass']);
  // gulp.watch(["*.html", "**/*.css"]).on('change', browserSync.reload);
  // gulp.watch(["*.html", "**/*.css"]).on('change', function(co){
  //   var f = path.relative(__dirname, co.path);
  //   console.log(f);
  //   console.log(co);
  //   browserSync.reload();
  //   // browserSync.reload(f + "");
  // });
});

// Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//   return gulp.src("app/scss/*.scss")
//     .pipe(sass())
//     .pipe(gulp.dest("app/css"))
//     .pipe(browserSync.stream());
// });

gulp.task('default', ['serve']);
