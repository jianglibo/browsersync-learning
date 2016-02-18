/**
 * @module
 */

var path = require('path');

module.exports = new EntryHolder();

function EntryHolder() {
  this.hash = {};
}

EntryHolder.prototype.push = function(fn, vfile) {
    this.hash[fn] = vfile;
};

EntryHolder.prototype.getBuffer = function(fp) {
  var vfile = this.hash[fp];
  if (vfile) {
    return vfile.contents;
  } else {
    return null;
  }
};
