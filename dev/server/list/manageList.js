module.exports = function (server, db) {
    var validateRequest = require("../auth/validateRequest");

    server.get("/api/v1/messageqa/data/list", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.messageqaapp.find({
                user : req.params.token
            },function (err, list) {
              if (err) {
                console.log(JSON.stringify(err, null, 4));
              } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
              }

            });
        });
        return next();
    });
    server.get("/api/v1/messageqa/data/therapistquestionlist", function (req, res, next) {
      console.log("Token:", req.params.token);
        db.messageqaapp.find({
            toID : req.params.token.toString()
        },function (err, list) {
            if (err){
              console.log(JSON.stringify(err, null, 4));
            } else {
              res.writeHead(200, {
                  'Content-Type': 'application/json; charset=utf-8'
              });
              console.log("List:", list);
              res.end(JSON.stringify(list));
            }
        });
        return next();
    });
    server.get("/api/v1/messageqa/data/listall", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.messageqaapp.find({},function (err, list) {
                if (err) {
                  console.log(JSON.stringify(err, null, 4));
                } else {
                  res.writeHead(200, {
                      'Content-Type': 'application/json; charset=utf-8'
                  });
                  res.end(JSON.stringify(list));
                }
            });
        });
        return next();
    });

    server.get('/api/v1/messageqa/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.messageqaapp.find({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                if (err) {
                  console.log(JSON.stringify(err, null, 4));
                } else {
                  res.writeHead(200, {
                      'Content-Type': 'application/json; charset=utf-8'
                  });
                  res.end(JSON.stringify(data));
                }
            });
        });
        return next();
    });

    server.post('/api/v1/messageqa/data/item', function (req, res, next) {
      console.log('hello');
        validateRequest.validate(req, res, db, function () {
            var item = req.params;
            db.messageqaapp.save(item,
                function (err, data) {
                    if (err){
                      console.log(err);
                    } else {
                      res.writeHead(200, {
                          'Content-Type': 'application/json; charset=utf-8'
                      });
                      res.end(JSON.stringify(data));
                    }

                });
        });
        return next();
    });

    server.put('/api/v1/messageqa/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.messageqaapp.findOne({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                // merge req.params/product with the server/product

                var updProd = {}; // updated products
                // logic similar to jQuery.extend(); to merge 2 objects.
                for (var n in data) {
                    updProd[n] = data[n];
                }
                for (var n in req.params) {
                    if (n != "id")
                        updProd[n] = req.params[n];
                }
                updProd['_id'] = db.ObjectId(req.params.id);
                db.messageqaapp.update({
                    _id: db.ObjectId(req.params.id)
                }, updProd, {
                    multi: false
                }, function (err, data) {
                  if (err) {
                    console.log('n', JSON.stringify(err, null, 4));
                  } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify(data));
                  }
                });
            });
        });
        return next();
    });

    server.del('/api/v1/messageqa/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.messageqaapp.remove({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
              if (err) {
                console.log('n', JSON.stringify(err, null, 4));
              } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
              }

            });
            return next();
        });
    });

}
