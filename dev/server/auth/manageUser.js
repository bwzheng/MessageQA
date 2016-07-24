var pwdMgr = require('./managePasswords');
var validateRequest = require("../auth/validateRequest");
module.exports = function (server, db) {
    // unique index
    db.appUsers.ensureIndex({
        email: 1
    }, {
        unique: true
    })

    server.post('/api/v1/messageqa/auth/register', function (req, res, next) {
        var user = req.params;
        pwdMgr.cryptPassword(user.password, function (err, hash) {
            if (err){
              console.log(err);
            }
            user.password = hash;
            // user.isTherapist = true;
            console.log("n", hash);
            db.appUsers.insert(user,
                function (err, dbUser) {
                    if (err) { // duplicate key error
                        if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                            res.writeHead(400, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: err,
                                message: "A user with this email already exists"
                            }));
                        }
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        dbUser.password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
        });
        return next();
    });

    server.get('/api/v1/messageqa/auth/', function (req, res, next) {
      validateRequest.validate(req, res, db, function (user) {

          console.log(JSON.stringify(user, null, 4))
          res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8'
          });
          // remove password hash before sending to the client
          res.end(JSON.stringify(user));
      });

      return next();
    });

    server.post('/api/v1/messageqa/auth/login', function (req, res, next) {
        var user = req.params;
        if (user.email.trim().length == 0 || user.password.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid Credentials"
            }));
        } else {
          console.log("in");
          db.appUsers.findOne({
              email: req.params.email
          }, function (err, dbUser) {


              pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {

                  if (isPasswordMatch) {
                      res.writeHead(200, {
                          'Content-Type': 'application/json; charset=utf-8'
                      });
                      // remove password hash before sending to the client
                      dbUser.password = "";
                      res.end(JSON.stringify(dbUser));
                  } else {
                      res.writeHead(403, {
                          'Content-Type': 'application/json; charset=utf-8'
                      });
                      res.end(JSON.stringify({
                          error: "Invalid User"
                      }));
                  }

              });
          });
          return next();
        }
    });
    server.post('/api/v1/messageqa/therapistauth/login', function (req, res, next) {
        var user = req.params;
        if (user.email.trim().length == 0 || user.password.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid Credentials"
            }));
        }


        db.therapistUsers.findOne({
            email: req.params.email
        }, function (err, dbUser) {
            if (err || !dbUser){
              console.log(JSON.stringify(err, null, 4));
            } else {
              pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {

                  if (isPasswordMatch) {
                      res.writeHead(200, {
                          'Content-Type': 'application/json; charset=utf-8'
                      });
                      // remove password hash before sending to the client
                      dbUser.password = "";
                      res.end(JSON.stringify(dbUser));
                  } else {
                      res.writeHead(403, {
                          'Content-Type': 'application/json; charset=utf-8'
                      });
                      res.end(JSON.stringify({
                          error: "Invalid User"
                      }));
                  }

              });
            }

        });
        return next();
    });
};
