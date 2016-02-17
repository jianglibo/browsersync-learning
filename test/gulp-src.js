var concatCb = require('../dev-lib/concat-cb');
var assert = require('assert');
var through2 = require('through2');

describe('gulp-src', function() {
  it('should in order', function(done) {
    concatCb(['dev-fixtures/src-ord/a.txt', 'dev-fixtures/src-ord/b.txt'], function(buf) {
      assert.equal('a', buf.toString().substring(0, 1));
      done();
    });
  });

  it('should in order1', function(done) {
    concatCb(['dev-fixtures/src-ord/b.txt', 'dev-fixtures/src-ord/a.txt'], function(buf) {
      assert.equal('b', buf.toString().substring(0, 1));
      done();
    });
  });
});

// it('should be called twice.', function(done) {
// var i = 0;
// concatCb(['dev-fixtures/src-ord/b.txt', 'dev-fixtures/src-ord/a.txt'])
//   .pipe(through2.obj(function(file, enc, cb) {
//     // console.log(file);
//     i++;
//     cb();
//   })).on('finish', function() {
//     assert.equal(2, i);
//     done();
//   });
// });

// });

// describe('gulp-stream', function() {
//   it('should be called once.', function(done) {
//     var i = 0;
//     var lastfile;
//     concatCb(['dev-fixtures/src-ord/b.txt', 'dev-fixtures/src-ord/a.txt'])
//       .pipe(through2.obj(function(file, enc, cb) {
//         // console.log('aaaaaaaa');
//         lastfile = file;
//         cb(); //discard file.
//       }, function(cb) {
//         this.push(lastfile);
//         cb();
//       }))
//       .pipe(through2.obj(function(file, enc, cb) {
//         console.log(file);
//         i++;
//         cb(null, file);
//       }))
//       .on('finish', function() {
//         assert.equal(1, i);
//         setTimeout(function() {
//           done();
//         }, 1000);
//       });
//   });
// });
