var db = require('./db.js');
var BaseModel = db.BaseModel;

function LayerModel() {

}

LayerModel.prototype.getLayerList = function(callback){
	// BaseModel.query(callback, 'SELECT l.id, l.id_code_num, l.name, l.department, l.theme, l.subtheme, l.family ' +
	// 							'FROM data.layer l '+
	// 							'order by l.name');
	BaseModel.query(callback, "SELECT l.id, l.summary, l.project_name, l.data_responsible, l.metadata_responsible, l.source, l.id_code_num, l.name, l.department, l.theme, l.subtheme, l.family, string_agg(k.keyword, ',') as keywords " +
								"FROM data.layer l, data.layer_keyword k " +
								"where l.id = k.id_layer " +
								"group by l.id order by l.name");
};

LayerModel.prototype.getLayer = function(id,callback){

	BaseModel.query(callback, 'SELECT l.id, l.id_code_num, l.name, l.department, l.theme, l.subtheme, l.family, ' +
								'l.filetype, l.crs, l.extension, l.scale, to_char(l.review_date, \'yyyy/MM/dd\') as review_date, ' +
								'to_char(l.edition_date, \'yyyy/MM/dd\') as edition_date, l.summary, l.project_name, ' +
								'l.source, l.publication, l.link, l.bounding_box, l.data_responsible, l.metadata_responsible, ' +
								'l.language, l.access_limitation, l.other_info, to_char(l.layer_creation, \'dd/MM/yyyy\') as layer_creation, to_char(l.layer_update, \'dd/MM/yyyy\') as layer_update ' +
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

		var id = insertId[0].id.toString();
		var code = '0000000'
		if(id.length >= 7){
			code = insertId;
		}else{
			code = code.slice(0, 7-id.length) + id;
		}
		
		BaseModel.query(callback(err,{id: insertId[0].id, id_code_num: code}),
			'UPDATE data.layer SET id_code_num=$1 WHERE id=$2',
			[(layer.department.slice(0, 3)+ layer.theme.slice(0, 3) + layer.subtheme.slice(0, 3) + code).toUpperCase(),  insertId[0].id]
		 );
		// callback(err,{id: insertId[0].id});
	},
		'INSERT INTO data.layer(department, theme, subtheme, family, name, filetype, crs, extension, scale, review_date, edition_date, summary, project_name, source, publication, link, data_responsible, metadata_responsible, language, access_limitation, other_info, layer_creation, layer_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, to_date($22,\'DD/MM/YYYY\'), to_date($23,\'DD/MM/YYYY\')) RETURNING id',
		[layer.department, layer.theme, layer.subtheme, layer.family, layer.name, layer.filetype, layer.crs, layer.extension, layer.scale, layer.review_date, layer.edition_date, layer.summary, layer.project_name, layer.source, layer.publication, layer.link, layer.data_responsible, layer.metadata_responsible, layer.language, layer.access_limitation, layer.other_info, layer.layer_creation, layer.layer_update]
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
		'UPDATE data.layer SET id_code_num=$1, department=$2, theme=$3, subtheme=$4, family=$5, name=$6, filetype=$7, crs=$8, extension=$9, scale=$10, review_date=now(), summary=$11, project_name=$12, source=$13, publication=$14, link=$15, data_responsible=$16, metadata_responsible=$17, language=$18, access_limitation=$19, other_info=$20, layer_creation=to_date($21,\'DD/MM/YYYY\'), layer_update=to_date($22,\'DD/MM/YYYY\') WHERE id=$23 RETURNING id',
		[layer.id_code_num, layer.department, layer.theme, layer.subtheme, layer.family, layer.name, layer.filetype, layer.crs, layer.extension, layer.scale, layer.summary, layer.project_name, layer.source, layer.publication, layer.link, layer.data_responsible, layer.metadata_responsible, layer.language, layer.access_limitation, layer.other_info, layer.layer_creation, layer.layer_update, layer.id]
	);
};

LayerModel.prototype.deleteLayer = function(id_layer,callback){

	BaseModel.query(function(err,insertId){
			BaseModel.query(function(err,insertId){

					callback(err,null);

				},'DELETE FROM data.layer WHERE id = $1', [id_layer]
			);

		}, 'DELETE FROM data.layer_keyword WHERE id_layer = $1', [id_layer]
	);
};
module.exports = LayerModel;
