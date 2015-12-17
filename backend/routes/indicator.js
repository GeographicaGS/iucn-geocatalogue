var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;

var db = require('../db/db.js');
var IndicatorModel = db.IndicatorModel;

router.get('/get_indicator_list/:id_program', auth, function(req, res, next) {
	var id_program = req.params.id_program;
	IndicatorModel.getIndicatorList(id_program, function(err,data){
		res.json({'results':data});
	});
});

router.get('/indicator/:id', auth, function(req, res, next) {
	var id = req.params.id;
	IndicatorModel.getIndicator(id,function(err,indicator){
		IndicatorModel.getIndicatorData(indicator[0].sql,function(err,indicatorData){
			delete indicator[0].sql;
			indicator[0].data = indicatorData;
			res.json(indicator[0]);
		});
	});
});

module.exports = router;


