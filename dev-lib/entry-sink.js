/**
 * @module
 */

var through2 = require('through2');
var util = require('util');
var path = require('path');
var eh = require('./entry-holder');
var chalk = require('chalk');

module.exports = EntrySink;

/**
 * @function
 * @return {Transform}
 */
function EntrySink(entryjs) {
  return through2.obj(function(file, enc, cb) {
    var history = file.history;
    var fullPath = history[history.length - 1];
    var fn = path.basename(fullPath);
    file._fn = fn;
    console.log(chalk.green(fn));
    if (path.extname(fn) === '.js') {
      eh.push(entryjs, file);
    } else {
      eh.push(entryjs + ".map", file);
    }
    cb(null, file);
  });
}
