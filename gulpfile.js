var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();
// var sass = require('gulp-sass');

// Static Server + watching scss/html files
gulp.task('serve', /*['sass'],*/ function() {

  browserSync.init({
    server: {
      baseDir: "./",
      // index: "mithril.html",
      middleware: [
        function(req, res, next) {
          console.log("Hi from first middleware");
          next();
        },
        function(req, res, next) {
          console.log("Hi from the second middleware");
          next();
        }
      ]
    }
  });

  // gulp.watch("app/scss/*.scss", ['sass']);
  gulp.watch(["*.html", "**/*.css"]).on('change', browserSync.reload);
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
