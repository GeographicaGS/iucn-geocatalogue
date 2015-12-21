var md5 = require('MD5');
var db = require('./db/db.js');
var UserModel = db.UserModel;

var AUTHTIMESTAMPTTL = 1000 * 60 * 5; // each 5 minutes

function authenticate(req, res, next) {
	
	var credentials = {
      hash : req.get("auth-hash"),
      username :req.get("auth-username"),
      timestamp : parseInt(req.get("auth-timestamp"))
  };

  if (!credentials.hash || !credentials.username || !credentials.timestamp){
		res.status(401);
		res.json({
		    "messsage" : "Missing auth headers"
		});

  }else{
  	var currentTime = new Date().getTime();
  	UserModel.getUser(credentials.username,function(err,users){

  		if(users && users.length == 1){
  			var user = users[0];

  			if ((currentTime - credentials.timestamp)  > AUTHTIMESTAMPTTL) {

          res.status(401);
          res.json({
              "messsage" : "Expired request"
          });
          return;
        }
        if (md5(credentials.username + user.password + credentials.timestamp) == credentials.hash){
            req.user = user;
            // login successfull, let's allow the request
            next();   
        }else{
            // bad username/ password
            res.status(401)
            res.json({
                "messsage" : "Bad credentials"
            });
        }
  			

  		}else{
  			res.status(401)
        res.json({
            "messsage" : "Bad credentials"
        });
        return;
  		}

		});
  }
	
}

function isAdmin(req, res, next) {
  authenticate(req, res, function(){
    if(req.user.profile == "Administrador"){
      next();
        
    }else{
      res.status(401)
      res.json({
          "messsage" : "Bad credentials"
      });
      return;
    }
    
  });
}

module.exports.authenticate = authenticate;
module.exports.isAdmin = isAdmin;