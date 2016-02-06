var gulp = require('gulp');
var path = require('path');
const through = require('through2');
const watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var mockerLoader = require('./middleware/mocker-loader');
var plumber = require('gulp-plumber');

var debug = require('gulp-debug');



const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

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
    bs.addMiddleware('', mockerLoader("mocks"), {
      override: true
    });
    // bs.addMiddleware('', require("./middleware/mock-central") , {
    //   override: true
    // });
    // bs.addMiddleware('', function(req, res, next) {
    //   if (mocks[req.url]) {
    //     return mocks[req.url](req, res);
    //   }
    //   next();
    // }, {
    //   override: true
    // });
  });
});

gulp.task('afterJsChange', function(){
  gulp.src('js/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    // .pipe(through.obj(function(file, enc, cb) {
    //   console.log(file.event);
    //   this.push(file);
    //   cb();
    // }))
    // .pipe(debug({title: "before-babel:"}))
    .pipe(babel())
    // .pipe(debug({title: "before-concat:"}))
    .pipe(concat('all.js'))
    // .pipe(debug({title: "before-sourcemaps:"}))
    .pipe(sourcemaps.write('.'))
    // .pipe(debug({title: "before-dist:"}))
    .pipe(gulp.dest('dist'));
});

// gulp.task('default', () =>
//     gulp.src('src/**/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(concat('all.js'))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('dist'))
// );

gulp.task('watch', function() {
  gulp.watch(["*.html", "**/*.css"]).on('change', browserSync.reload);
  gulp.watch(["js/*.js"], ["afterJsChange"]);
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
gulp.task('serve', ['runBs', 'watch'], function(cb) {
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
