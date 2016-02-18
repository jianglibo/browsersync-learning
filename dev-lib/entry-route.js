var express = require('express');
var eh = require('./entry-holder');


module.exports = function(app, entryjs) {
  var entryRoute = express.Router();

  entryRoute.get(entryjs, function(req, res) {
    var buf = eh.getBuffer(req.path);

    if (buf) {
      res.send(buf);
    } else {
      res.status(404).end();
    }
  });

  entryRoute.get(entryjs + ".map", function(req, res) {
    var buf = eh.getBuffer(req.path);
    if (buf) {
      res.send(buf);
    } else {
      res.status(404).end();
    }
  });

  app.use('/', entryRoute);
};
