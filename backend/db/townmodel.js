var db = require('./db.js');
var BaseModel = db.BaseModel;

function TownModel() {

}

TownModel.prototype.getTownGeom = function(callback){
	BaseModel.query(callback, 'select descripcion as name, ST_AsGeoJSON(ST_Transform(geom,4326)) as geom from data.municipios where geom is not null');
};


module.exports = TownModel;

