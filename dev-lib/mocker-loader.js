"use strict";
var path = require('path');
var fs = require('fs');
var express = require('express');

/**
 * @module
 */

module.exports = function mockerLoader(mocksPath, entryjs) {
  var app = express();
  require('./entry-route')(app, entryjs);
  mocksPath = path.join(process.cwd(), mocksPath || 'mocks');

  fs.readdirSync(mocksPath).forEach(function(it) {
    require(path.join(mocksPath, it))(app);
  });
  return app;
};
