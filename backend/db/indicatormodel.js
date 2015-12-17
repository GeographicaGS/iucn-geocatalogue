var db = require('./db.js');
var BaseModel = db.BaseModel;

function IndicatorModel() {

}

IndicatorModel.prototype.getIndicatorList = function(id_program, callback){
	BaseModel.query(callback, 'select id, nombre ' +
								'from data.indicadores WHERE id_program = $1'+
								'order by id', [id_program]);
};

IndicatorModel.prototype.getIndicator = function(id,callback){
	BaseModel.query(callback, 'select id, nombre, sql ' +
								'from data.indicadores '+
								'where id=$1 '+
								'order by nombre', [id]);
};

IndicatorModel.prototype.getIndicatorData = function(sql,callback){
	BaseModel.query(callback, sql);
};


module.exports = IndicatorModel;

