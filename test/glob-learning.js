var path = require('path');
var fs = require('fs');
var assert = require('assert');
var glob = require("glob");

describe('Glob', function() {
  describe('#**', function() {
    this.timeout(50000);
    it('should handle **', function(done) {
      glob("**/*.js", {}, function(er, files) {
        assert(files.length > 1000, "should match all js in project.");
        done();
      });
    });

    it('should match one file', function(done) {
      glob("./dev-fixtures/*.js", {}, function(er, files) {
        console.log(files.length);
        assert(files.length === 1);
        done();
      });
    });

    it('should match one file when single * in path', function(done) {
      glob("./dev-fixtures/*/*.js", {}, function(er, files) {
        console.log(files.length);
        assert(files.length === 1);
        done();
      });
    });

    it('should match one file', function(done) {
      glob("./dev-fixtures/**/*.js", {}, function(er, files) {
        assert(files.length === 2);
        done();
      });
    });
  });
});
