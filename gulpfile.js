var gulp = require('gulp');
var path = require('path');
const through = require('through2');
const watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var mockerLoader = require('./middleware/mocker-loader');


const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

// var sass = require('gulp-sass');

gulp.task('bs', function() {
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

gulp.task('mywatch', function() {
  gulp.watch(["*.html", "**/*.css"]).on('change', browserSync.reload);
});

// Static Server + watching scss/html files
// gulp.task('serve', /*['sass'],*/ function() {
gulp.task('serve', ['bs', 'mywatch'], function() {
  gulp.src('js/*.js')
    .pipe(watch('js/*.js', {
      // read: false,
      events: ['add', 'change', 'unlink']
    })) // as a trigger.
    .pipe(through.obj(function(file, enc, cb) {
      console.log(file);
      cb(null, file);
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

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
