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
var Vfile = require('vinyl');
var fs = require('fs');
var uglify = require('gulp-uglify');
var hash = require('gulp-hash');
var rename = require("gulp-rename");
var merge2 = require('merge2');
var gulpif = require('gulp-if');
var named = require('vinyl-named');
var eh = require('./dev-lib/entry-holder');


const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const entryjs = "app.js";
const wwwRoot = "/";

const toPrepend = ["shims/xmlhttprequest.js", "node_modules/mithril/mithril.js"];

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
    bs.addMiddleware('', mockerLoader("mocks", wwwRoot + entryjs), {
      override: true
    });
  });
});

gulp.task('stopBs', function() {
  browserSync.exit();
});

gulp.task('afterJsChange', function() {
  merge2(
      gulp.src(toPrepend),
      gulp.src(['./dev-js/t.js'])
      .pipe(plumber())
      // .pipe(debug({title: "before-babel:"}))
      // .pipe(named())
      .pipe(webpack( /*{ devtool: 'source-map' }*/ ))
      // .pipe(through2.obj(function(file, enc, cb) {
      //   // Dont pipe through any source map files as it will be handled
      //   // by gulp-sourcemaps
      //   var isSourceMap = /\.map$/.test(file.path);
      //   if (!isSourceMap) this.push(file);
      //   cb();
      // }))
      .pipe(babel())) //only one file
    .pipe(sourcemaps.init( /* { loadMaps: true }*/ ))
    .pipe(concat(entryjs))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    // .pipe(hash())
    // .pipe(entrySink(entryjs))
    .pipe(named(function(file){
      return path.basename(file.path);
    }))
    .pipe(through2.obj(function(file, enc, cb) { // got two file.
      eh.push(wwwRoot + file.named, file);
      cb(null, file);
    }))
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

// Static Server + watching scss/html files
// gulp.task('serve', /*['sass'],*/ function() {
gulp.task('serve', ['runBs', 'watch', 'afterJsChange'], function(cb) {
  console.log("started");
  cb();
});

// Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//   return gulp.src("app/scss/*.scss")
//     .pipe(sass())
//     .pipe(gulp.dest("app/css"))
//     .pipe(browserSync.stream());
// });

gulp.task('default', ['serve']);
