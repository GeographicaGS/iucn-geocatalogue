var db = require('./db.js');
var BaseModel = db.BaseModel;

function LayerModel() {

}

LayerModel.prototype.getLayerList = function(callback){
	BaseModel.query(callback, 'SELECT l.id, l.id_code_num, l.name, l.department, l.theme, l.subtheme, l.family ' +
								'FROM data.layer l '+
								'order by l.name');
};

LayerModel.prototype.getLayer = function(id,callback){

	BaseModel.query(callback, 'SELECT l.id, l.id_code_num, l.name, l.department, l.theme, l.subtheme, l.family, ' +
								'l.filetype, l.crs, l.extension, l.scale, to_char(l.review_date, \'yyyy/MM/dd\') as review_date, ' +
								'to_char(l.edition_date, \'yyyy/MM/dd\') as edition_date, l.summary, l.project_name, ' +
								'l.source, l.publication, l.link, l.bounding_box, l.data_responsible, l.metadata_responsible, ' +
								'l.language, l.access_limitation, l.other_info ' +
								'FROM data.layer l '+
								'WHERE l.id = $1', [id]);
};

LayerModel.prototype.getLayerKeywords = function(id,callback){

	BaseModel.query(callback, 'SELECT k.keyword ' +
								'FROM data.layer_keyword k '+
								'WHERE k.id_layer = $1', [id]);
};

LayerModel.prototype.insertLayer = function(layer,callback){
	BaseModel.query(function(err,insertId){
		for (keyword of layer.keywords) {
			BaseModel.query(null,
				'INSERT into data.layer_keyword(id_layer, keyword) VALUES ($1, $2)',
				[insertId[0].id, keyword]
			);
		}
		// console.log('Callback en layermodel: ' + callback);
		callback(err,{id: insertId[0].id});
	},
		'INSERT INTO data.layer(id_code_num, department, theme, subtheme, family, name, filetype, crs, extension, scale, review_date, edition_date, summary, project_name, source, publication, link, data_responsible, metadata_responsible, language, access_limitation, other_info) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id',
		[layer.id_code_num, layer.department, layer.theme, layer.subtheme, layer.family, layer.name, layer.filetype, layer.crs, layer.extension, layer.scale, layer.review_date, layer.edition_date, layer.summary, layer.project_name, layer.source, layer.publication, layer.link, layer.data_responsible, layer.metadata_responsible, layer.language, layer.access_limitation, layer.other_info]
	);
};

LayerModel.prototype.updateLayer = function(layer,callback){

	BaseModel.query(function(err,insertId){
		BaseModel.query(function(err,insertId){
				for (keyword of layer.keywords) {
					BaseModel.query(null,
						'INSERT into data.layer_keyword(id_layer, keyword) VALUES ($1, $2)',
						[layer.id, keyword]
					);
				}
				callback(err,{id: insertId});
			},
			'DELETE FROM data.layer_keyword WHERE id_layer = $1', [layer.id]
		);
	},
		'UPDATE data.layer SET id_code_num=$1, department=$2, theme=$3, subtheme=$4, family=$5, name=$6, filetype=$7, crs=$8, extension=$9, scale=$10, review_date=$11, edition_date=$12, summary=$13, project_name=$14, source=$15, publication=$16, link=$17, data_responsible=$18, metadata_responsible=$19, language=$20, access_limitation=$21, other_info=$22 WHERE id=$23 RETURNING id',
		[layer.id_code_num, layer.department, layer.theme, layer.subtheme, layer.family, layer.name, layer.filetype, layer.crs, layer.extension, layer.scale, layer.review_date, layer.edition_date, layer.summary, layer.project_name, layer.source, layer.publication, layer.link, layer.data_responsible, layer.metadata_responsible, layer.language, layer.access_limitation, layer.other_info, layer.id]
	);
};

LayerModel.prototype.deleteLayer = function(id_layer,callback){

	BaseModel.query(function(err,insertId){
		BaseModel.query(function(err,insertId){

				callback(err,null);
			},
			'DELETE FROM data.layer_keyword WHERE id_layer = $1', [id_layer]
		);
	},
		'DELETE FROM data.layer WHERE id = $1',
		[id_layer]
	);
};
module.exports = LayerModel;
