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
var concatCb = require('./dev-lib/concat-cb');
var uglify = require('gulp-uglify');
var hash = require('gulp-hash');
var rename = require("gulp-rename");


const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const entryjs = "app.js";

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
    .pipe(webpack())
    .pipe(babel()) //only one file.
    // .pipe(through2.obj(function(file, enc, cb) {
    //   cb(null, file);
    // }, function(cb) {
    //   var f = new Vfile({
    //     // cwd: "/",
    //     // base: "/test/",
    //     path: xmlhttprequestShim,
    //     contents: fs.readFileSync(xmlhttprequestShim)
    //   });
    //   this.push(f);
    //   cb();
    // }))
    // .pipe(concat(entryjs))
    //<!---- prepend my staff here --------->
    .pipe(through2.obj(function(file,enc,cb){
      //must only one file;
      concatCb(toPrepend, function(buf){
        file.contents = Buffer.concat([buf, file.contents]);
        cb(null, file);
      });
    }))
    .pipe(uglify())
    // .pipe(rename(entryjs))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    // .pipe(gulp.dest('dist'));
    // .pipe(hash())
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

gulp.task('wp', function() {
  return gulp.src(['app/app.js'])
    .pipe(named())
    .pipe(webpack({
      devtool: 'source-map'
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(through.obj(function (file, enc, cb) {
      // Dont pipe through any source map files as it will be handled
      // by gulp-sourcemaps
      var isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) this.push(file);
      cb();
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'));
});
