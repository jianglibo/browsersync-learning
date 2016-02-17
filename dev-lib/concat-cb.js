var gulp = require('gulp');
var through2 = require('through2');
/**
 * @constructor
 * @param {string[]} - list of file names, in order.
 */
module.exports = function(fnlist, done) {
  var buffers = [];
  var pp = gulp.src(fnlist)
    .pipe(through2.obj(function(file, enc, cb) {
      buffers.push(file.contents);
      cb();
    }, function(cb) {
      cb();
      done(Buffer.concat(buffers));
    }));
};
