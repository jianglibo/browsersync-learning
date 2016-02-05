module.exports = function(app) {
  var express = require('express');
  var keypairsRouter = express.Router();

   var list = {
      "_links" : {
        "self" : {
          "href" : "http://localhost/api/v1/keypairs{?page,size,sort,projection}",
          "templated" : true
        },
        "search" : {
          "href" : "http://localhost/api/v1/keypairs/search"
        }
      },
      "_embedded" : {
        "keypairs" : [ {
          "id" : 1,
          "createdAt" : "2015-10-16T22:46:48.252+0000",
          "archived" : false,
          "keyId" : "FCADCE51A1944BA69C3964CF637FE2FC",
          "keySecret" : "257ae85d4dcc4e7baaeb4fef9d93c7d5",
          "useTimes" : 0,
          "_links" : {
            "self" : {
              "href" : "http://localhost/api/v1/keypairs/1{?projection}",
              "templated" : true
            },
            "creator" : {
              "href" : "http://localhost/api/v1/keypairs/1/creator"
            }
          }
        } ]
      },
      "page" : {
        "size" : 20,
        "totalElements" : 1,
        "totalPages" : 1,
        "number" : 0
      }
    };

  keypairsRouter.get('/', function(req, res) {
    res.send(list);
  });

  keypairsRouter.post('/', function(req, res) {
    var one = list._embedded.keypairs[0],
        id = one.id + 1;

    one.id = id;
    res.append("Location", "/api/v1/keypairs/" + id);
    res.status(201).end();
  });

  keypairsRouter.get('/:id', function(req, res) {
    var one = list._embedded.keypairs[0],
        id = req.params.id;

    one.id = parseInt(id, 10);
    res.send( one );
  });

  keypairsRouter.put('/:id', function(req, res) {
    res.send({
      'keypairs': {
        id: req.params.id
      }
    });
  });

  keypairsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/keypairs', keypairsRouter);
};
