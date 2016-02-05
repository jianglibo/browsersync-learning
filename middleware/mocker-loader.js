"use strict";
var path = require('path');
var fs = require('fs');
var express = require('express');
// var Mocker = require('../utils/mocker');
/**
 * @module
 */

module.exports = function mockerLoader(mocksPath) {
  var app = express();
  mocksPath = path.join(process.cwd(), mocksPath || 'mocks');

  fs.readdirSync(mocksPath).forEach(function(it) {
    require(path.join(mocksPath, it))(app);
  });
  return app;
};



// module.exports = function mockerCentral(req, res, next) {
//   // console.log(req.url);
//   // console.log(req.method);
//   // console.log(__dirname);
//   // console.log(process.cwd());
//   console.log(mk);
//   console.log(mk[req.method]);
//   var router = mk[req.method.toUpperCase()][req.url];
//   console.log(router);
//   if (router) {
//     return router(req, res);
//   }
//   // res.on('end', function(){
//   //   console.log('ended.');
//   //   res.write("abc");
//   // });
//   next();
// };
