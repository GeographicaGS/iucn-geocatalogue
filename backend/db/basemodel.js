var pg = require('pg');
var dbconfig = {
      user: process.env.POSTGRES_USER || null,
      password: process.env.POSTGRES_PASSWORD || null,
      host: process.env.POSTGRES_HOST || localhost,
      port: process.env.POSTGRES_PORT || 5432,
      db: process.env.POSTGRES_DB || 'db'
    };

function BaseModel() {
	this._conString = 'postgres://' + dbconfig.user + ':' + dbconfig.password + '@' + dbconfig.host + ':' + dbconfig.port + '/' + dbconfig.db;
}

BaseModel.prototype.query = function(callback,query,parameters){
	pg.connect(this._conString, function(err, db, done) {
    if(!err){
  		db.query(query,parameters, function(err, result) {
  			done();
  			if(err) {
          return console.error('error running query', err);
  	    }
  			callback(err,result.rows);
  		});
    }else{
      console.error(err);
    }
	});
};

module.exports = BaseModel;
