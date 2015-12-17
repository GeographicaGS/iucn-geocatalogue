var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;
var isAdmin = require('../auth.js').isAdmin;

var db = require('../db/db.js');
var ApplyModel = db.ApplyModel;

router.get('/get_apply_list/:id_program', auth, function(req, res, next) {
	var id_program = req.params.id_program;
	ApplyModel.getApplyList(id_program, function(err,data){
		res.json({'results':data});
	});
});


router.get('/get_apply_geom/:id_program', auth, function(req, res, next) {
	var id_program = req.params.id_program;
	ApplyModel.getApplyListGeom(id_program, function(err,data){
		res.json({'results':data});
	});
});

router.get('/apply/:id', auth, function(req, res, next) {
	var id = req.params.id;
	ApplyModel.getApply(id,function(err,apply){
		ApplyModel.getSectors(function(err,sectors){
			ApplyModel.getIntervetionsTypes(function(err,intervetions){
				ApplyModel.getIntervetionGroup(function(err,intervetionsGroups){
					apply[0].sectors = sectors;
					apply[0].intervetions = intervetions;
					apply[0].intervetionsGroups = intervetionsGroups;
					res.json(apply[0]);
				});
			});
		});
	});
});

router.get('/apply/program/:id_program', isAdmin, function(req, res, next) {
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

router.put('/post_apply_basic/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateApplicant(req.body,function(err,apply){
		ApplyModel.updateBasicApply(req.body,function(err,apply){
			res.json({'results':true});
		});
	});
});

router.put('/post_apply_intervention/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateInterventionApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.put('/post_apply_import/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateImportApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.put('/post_apply_execute/:id', isAdmin, function(req, res, next) {
	ApplyModel.updateExecutionApply(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.get('/get_apply_incidences/:id', auth, function(req, res, next) {
	var id = req.params.id;
	ApplyModel.getIncidences(id,function(err,incidences){
		res.json({'results':incidences});
	});
});

router.post('/post_apply_incidence', isAdmin, function(req, res, next) {
	ApplyModel.insertIncidence(req.body,function(err,apply){
		res.json({'results':true});
	});
});

router.delete('/remove_apply_incidence/:id', isAdmin, function(req, res, next) {
	var id = req.params.id;
	ApplyModel.removeIncidence(id,function(err,apply){
		res.json({'results':true});
	});
});

router.post('/post_new_apply', isAdmin, function(req, res, next) {
	
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


