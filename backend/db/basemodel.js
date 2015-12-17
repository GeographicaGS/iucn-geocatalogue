var pg = require('pg'),
    config = require('../config.js')

function BaseModel() {
	this._conString = 'postgres://' + config.database.user + ':' + config.database.password + '@' + config.database.host + ':' + config.database.port + '/' + config.database.db;
}

BaseModel.prototype.query = function(callback,query,parameters){
	pg.connect(this._conString, function(err, db, done) {
		db.query(query,parameters, function(err, result) {
			done();
			if(err) {
	      		return console.error('error running query', err);
	    	}
			callback(err,result.rows);
		});
	});
};

module.exports = BaseModel;