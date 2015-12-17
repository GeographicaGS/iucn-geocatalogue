var db = require('./db.js');
var BaseModel = db.BaseModel;

function ApplyModel() {

}

ApplyModel.prototype.getApplyList = function(id_program, callback){
	BaseModel.query(callback, 'select e.id, m.descripcion as town, solicitud,denominacion, motivo_cierre_expediente as estado, med.nombre as medida, ' +
								'ST_X(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_x, ' +
								'ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_y, ' +
								'ST_X(ST_Centroid(ST_Transform(geom,4326))) as coord_x_m, ' +
								'ST_Y(ST_Centroid(ST_Transform(geom,4326))) as coord_y_m ' +
								'from data.expedientes e '+
								'left join data.municipios m on e.municipio = m.id ' +
								'left join data.grupo_intervencion i on i.gi=e.gi ' +
								'left join data.medidas med on i.medida=med.id ' +
								'WHERE e.id_program = $1 ' +
								'order by solicitud', [id_program]);
};

ApplyModel.prototype.getApplyListGeom = function(id_program, callback){
	
	BaseModel.query(callback, 'select e.id, solicitud, denominacion, motivo_cierre_expediente as estado, ' +
								'ST_X(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_x, ' +
								'ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_y, ' +
								'ST_X(ST_Centroid(ST_Transform(geom,4326))) as coord_x_m, ' +
								'ST_Y(ST_Centroid(ST_Transform(geom,4326))) as coord_y_m ' +
								'from data.expedientes e '+
								'left join data.municipios m on e.municipio = m.id and (coord_x is null or coord_y is null) WHERE e.id_program = $1', [id_program]);
};

ApplyModel.prototype.getApply = function(id,callback){

	BaseModel.query(callback, 'select e.id, solicitud, motivo_cierre_expediente as estado, expte, denominacion, municipio as ine, m.descripcion as municipio, e.descripcion, pagos_sum."Inversión Comproba en Certificación" as inversion_prevista, pagos_sum."Inversión Certificada Subvencionable" as subvencion_concedida, s."Solicitante" as solicitante, s."DNI/CIF" as dni, s."Email" as email, s."Tlfnos" as tlf, sec.descripcion as sector, e.sector_actividad, e.promovido_por_mujer, e.promovido_por_joven, e.observaciones, e.subvencion_propuesta_ite, e.plus_porcentual, e.suplementaria, tipoInt.tipo_intervencion as intervention_type_name, e.tipo_intervencion, e."descripcion_intervención" as descripcion_intervencion, e.presupuesto_solicitud, e.inversion_subvencionable, e.subvencion_solicitada, e.inversion_en_contrato, e.subvencion_concedida_condicionada, e.anyadir_gi, to_char(e.fechalimite_inicio, \'dd/MM/yyyy\') as fechalimite_inicio, to_char(e.fechalimite_finalizacion, \'dd/MM/yyyy\') as fechalimite_finalizacion, e.normas_competencia, e.inversion_final_realizada, e.inversion_final_subvencionable, e.g1_igualdad_h_m, e.g2_formacion_igualdad_empleo, e.g3_autoempleo_empleo_calidad_mujeres, e.g4_conciliacion_laboral_familiar, e.g5_fomento_participacion_mujeres, e.g6_conocimiento_mujeres, e.g7_ocio_enfoque_genero, e.g8_otra_cat_incidencia, e.j1_educacion_valores_juventud, e.j2_formacion_juventud, e.j3_autoempleo_empleo_calidad_juventud, e.j4_participacion_juventud, e.j5_conocimiento_juventud, e.j6_ocio_juventud, e.j7_otra_cat_incidencia, e.calificacion_intervencion, int.gi, int.nombre as intervention_group_name, ' +
								'ST_X(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_x, ' +
								'ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint(coord_x, coord_y),25830),4326)) as coord_y, ' +
								'ST_X(ST_Centroid(ST_Transform(geom,4326))) as coord_x_m, ' +
								'ST_Y(ST_Centroid(ST_Transform(geom,4326))) as coord_y_m ' +
								'from data.expedientes e '+
								'left join data.municipios m on e.municipio = m.id '+
								'left join data.solictantes s on s."DNI/CIF" = e.solicitante '+
								'left join data.sector_actividad sec on sec.id = e.sector_actividad '+
								'left join data.tipo_intervencion tipoInt on tipoInt.id = e.tipo_intervencion '+
								'left join data.grupo_intervencion int on int.gi = e.gi ' +
								'left join data.pagos_sum on pagos_sum.id_expediente = e.id ' +
								'where e.id = $1', [id]);
};

ApplyModel.prototype.getSectors = function(callback){
	BaseModel.query(callback, 'select id, descripcion ' +
								'from data.sector_actividad '+
								'order by id');
};

ApplyModel.prototype.getIntervetionsTypes = function(callback){
	BaseModel.query(callback, 'select id, tipo_intervencion ' +
								'from data.tipo_intervencion '+
								'order by id');
};

ApplyModel.prototype.getIntervetionGroup = function(callback){
	BaseModel.query(callback, 'select gi, nombre ' +
								'from data.grupo_intervencion '+
								'order by gi');
};

ApplyModel.prototype.getTowns = function(callback){
	BaseModel.query(callback, 'select id, descripcion ' +
								'from data.municipios '+
								'order by descripcion');
};


ApplyModel.prototype.updateBasicApply = function(apply, callback){

	BaseModel.query(callback, 'UPDATE data.expedientes '+
							   'SET sector_actividad=$1, promovido_por_mujer=$2, promovido_por_joven=$3, '+
							   'g1_igualdad_h_m= $4, g2_formacion_igualdad_empleo= $5, g3_autoempleo_empleo_calidad_mujeres= $6, g4_conciliacion_laboral_familiar= $7, g5_fomento_participacion_mujeres= $8, g6_conocimiento_mujeres= $9, g7_ocio_enfoque_genero= $10, g8_otra_cat_incidencia= $11, j1_educacion_valores_juventud= $12, j2_formacion_juventud= $13, j3_autoempleo_empleo_calidad_juventud= $14, j4_participacion_juventud= $15, j5_conocimiento_juventud= $16, j6_ocio_juventud= $17, j7_otra_cat_incidencia= $18, ' +
							   'coord_x= ST_X(ST_Transform(ST_SetSRID(ST_MakePoint($19, $20),4326),25830)), '+
							   'coord_y= ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint($19, $20),4326),25830)), '+
							   'descripcion= $21 ' +
							 'WHERE id= $22',[apply.sector_actividad, apply.promovido_por_mujer, apply.promovido_por_joven, apply.g1_igualdad_h_m, apply.g2_formacion_igualdad_empleo, apply.g3_autoempleo_empleo_calidad_mujeres, apply.g4_conciliacion_laboral_familiar, apply.g5_fomento_participacion_mujeres, apply.g6_conocimiento_mujeres, apply.g7_ocio_enfoque_genero, apply.g8_otra_cat_incidencia, apply.j1_educacion_valores_juventud, apply.j2_formacion_juventud, apply.j3_autoempleo_empleo_calidad_juventud, apply.j4_participacion_juventud, apply.j5_conocimiento_juventud, apply.j6_ocio_juventud, apply.j7_otra_cat_incidencia, apply.coord_x, apply.coord_y, apply.descripcion, apply.id]);
};

ApplyModel.prototype.updateApplicant = function(applicant, callback){
	BaseModel.query(callback, 'UPDATE data.solictantes '+
							   'SET "Solicitante"=$1, "Tlfnos"=$2, "Email"=$3 '+
							 'WHERE "DNI/CIF"=$4',[applicant.solicitante, applicant.tlf, applicant.email, applicant.dni]);
};

ApplyModel.prototype.updateInterventionApply = function(applicant, callback){
	BaseModel.query(callback, 'UPDATE data.expedientes '+
							   'SET subvencion_propuesta_ite=$1, plus_porcentual=$2, suplementaria=$3, tipo_intervencion=$4, calificacion_intervencion=$5, gi=$6, "descripcion_intervención"=$7 '+
							 'WHERE id=$8',[applicant.subvencion_propuesta_ite, applicant.plus_porcentual, applicant.suplementaria, applicant.tipo_intervencion, applicant.calificacion_intervencion, applicant.gi, applicant.descripcion_intervencion, applicant.id]);
};

ApplyModel.prototype.updateImportApply = function(applicant, callback){
	// BaseModel.query(callback, 'UPDATE data.expedientes '+
	// 						   'SET inversion_prevista=$1, presupuesto_solicitud=$2, inversion_subvencionable=$3, subvencion_solicitada=$4, inversion_en_contrato=$5, importe_pagado=$6, subvencion_concedida_condicionada=$7, anyadir_gi=$8 '+
	// 						 'WHERE solicitud=$9',[applicant.inversion_prevista, applicant.presupuesto_solicitud, applicant.inversion_subvencionable, applicant.subvencion_solicitada, applicant.inversion_en_contrato, applicant.subvencion_concedida, applicant.subvencion_concedida_condicionada, applicant.anyadir_gi, applicant.solicitud]);

	BaseModel.query(function(){

		BaseModel.query(callback, 'UPDATE data.pagos_sum '+
							  	  'SET "Inversión Comproba en Certificación"=$1, "Inversión Certificada Subvencionable"=$2 '+
							 	  'WHERE id_expediente=$3',[applicant.inversion_prevista, applicant.subvencion_concedida, applicant.id]);

	}, 'UPDATE data.expedientes '+
	   'SET presupuesto_solicitud=$1, inversion_subvencionable=$2, subvencion_solicitada=$3, inversion_en_contrato=$4, subvencion_concedida_condicionada=$5, anyadir_gi=$6 '+
	   'WHERE id=$7',[applicant.presupuesto_solicitud, applicant.inversion_subvencionable, applicant.subvencion_solicitada, applicant.inversion_en_contrato, applicant.subvencion_concedida_condicionada, applicant.anyadir_gi, applicant.id]);

	


	
};

ApplyModel.prototype.updateExecutionApply = function(applicant, callback){
	BaseModel.query(callback, 'UPDATE data.expedientes '+
							   'SET fechalimite_inicio=to_date($1, \'dd/MM/yyyy\'), fechalimite_finalizacion=to_date($2, \'dd/MM/yyyy\'), normas_competencia=$3 '+
							 'WHERE id=$4',[applicant.fechalimite_inicio, applicant.fechalimite_finalizacion, applicant.normas_competencia, applicant.id]);
};

ApplyModel.prototype.getIncidences = function(id,callback){

	BaseModel.query(callback, 'select i.id, i.description, to_char(i.date, \'dd/MM/yyyy - HH24:MI\') as date, u.name, u.surname ' +
								'from data.incidence i '+
								'inner join data."user" u on u.id = i.id_user '+
								'where i.id_expediente = $1 order by i.date', [id]);
};

ApplyModel.prototype.insertIncidence = function(incidence,callback){

	BaseModel.query(callback, 'INSERT INTO data.incidence(id_user, date, description, id_expediente) VALUES ((select id from data.user where email=$1), CURRENT_TIMESTAMP, $2, $3)', [incidence.user,incidence.description, incidence.apply]);
};

ApplyModel.prototype.removeIncidence = function(id,callback){

	BaseModel.query(callback, 'DELETE FROM data.incidence WHERE id=$1', [id]);
};

ApplyModel.prototype.insertApply = function(apply,callback){
	
	apply.solicitante = apply.solicitante.toUpperCase();
	
	BaseModel.query(function(err,count){

		var count = count[0].count;
		var solicitud = parseInt(count);
		if(solicitud < 10){
			count = '00' + count;
		}else if(solicitud < 100){
			count = '0' + count;
		}

		var expte = new Date().getFullYear() + '/SE07/' + apply.gi + '/' + count;
		solicitud = count;

		BaseModel.query(function(err,insertId){

			var insertId = insertId[0]

			BaseModel.query(function(err,pagos){

				BaseModel.query(function(err, solicitante){

					if(solicitante.length > 0){
						callback(err, insertId);

					}else{
						BaseModel.query(function(){
							callback(err, insertId);

						}, 'INSERT INTO data.solictantes("DNI/CIF") VALUES ($1)', [apply.solicitante]);
					}

				}, 'select "DNI/CIF" from data.solictantes where "DNI/CIF" = $1', [apply.solicitante]);
				

			}, 'INSERT INTO data.pagos_sum(id_expediente) VALUES ($1)', [insertId.id]);



		}, 'INSERT INTO data.expedientes(expte, denominacion, observaciones, municipio, solicitante, gi, id_program, coord_x, coord_y, solicitud, motivo_cierre_expediente ) VALUES ($1,$2,$3,$4,$5,$6,$7,' +
			'ST_X(ST_Transform(ST_SetSRID(ST_MakePoint($8, $9),4326),25830)),' +
			'ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint($8, $9),4326),25830)), $10, $11) RETURNING id'
			, [expte, apply.denominacion, apply.observaciones, apply.municipio, apply.solicitante, apply.gi, apply.id_program, apply.coord_x, apply.coord_y, solicitud, 'Pendiente']);


	}, 'SELECT COUNT(*) + 1 as count FROM data.expedientes WHERE id_program = $1', [apply.id_program]);

	// BaseModel.query(callback, 'INSERT INTO data.expedientes(solicitud, expte, denominacion, descripcion, municipio, solicitante, gi, observaciones, id_program ) VALUES ()', []);
};


ApplyModel.prototype.updateStateApply = function(id,state,callback){
	BaseModel.query(callback, 'UPDATE data.expedientes '+
							  	'SET motivo_cierre_expediente = $1 '+
							 	'WHERE id = $2',[state, id]);
};




module.exports = ApplyModel;

