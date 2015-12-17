var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;
var isAdmin = require('../auth.js').isAdmin;

var db = require('../db/db.js');
var LayerModel = db.LayerModel;

router.get('/get_layer_list', auth, function(req, res, next) {
	LayerModel.getLayerList(function(err,data){
		res.json({'results':data});
	});
});

router.get('/layer/:id', auth, function(req, res, next) {
	var id = req.params.id;
	LayerModel.getLayer(id,function(err,layer){
		LayerModel.getLayerKeywords(id, function(err, keywords){
			layer[0].keywords = Object.keys(keywords).map(function(k){return keywords[k].keyword});
			res.json(layer[0]);
		});
	});
});

router.get('/layer/program/:id_program', isAdmin, function(req, res, next) {
	var id_program = req.params.id_program;
	var apply = {};
	ApplyModel.getTowns(function(err,towns){

		ApplyModel.getIntervetionGroup(function(err,intervetionsGroups){
			apply.id_program = id_program;
			apply.towns = towns;
			apply.intervetionsGroups = intervetionsGroups;
			res.json(apply);
		});
	});
});

router.put('/post_layer_basic/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateApplicant(req.body,function(err,apply){
		ApplyModel.updateBasicApply(req.body,function(err,apply){
			res.json({'results':true});
		});
	});
});

router.put('/post_layer_intervention/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateInterventionApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.put('/post_layer_import/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateImportApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.put('/post_layer_execute/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateExecutionApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.get('/get_layer_incidences/:id', auth, function(req, res, next) {
	var id = req.params.id;
	ApplyModel.getIncidences(id,function(err,incidences){
		res.json({'results':incidences});
	});
});

router.post('/post_new_layer', isAdmin, function(req, res, next) {

	ApplyModel.insertApply(req.body,function(err,apply){
		res.json({'results':apply});
	});
});

router.post('/change_state/:id', isAdmin, function(req, res, next) {
	var id = req.params.id;
	ApplyModel.updateStateApply(id, req.body.state, function(err,apply){
		res.json({'results':'true'});
	});
});




module.exports = router;
