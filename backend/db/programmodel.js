var db = require('./db.js');
var BaseModel = db.BaseModel;

function ProgramModel() {

}

ProgramModel.prototype.getProgramList = function(callback){
	BaseModel.query(callback, 'select id, name, is_default ' +
								'from data.program '+
								'order by id');
};


module.exports = ProgramModel;

