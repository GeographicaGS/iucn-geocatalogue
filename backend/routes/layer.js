var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;
var isAdmin = require('../auth.js').isAdmin;

var db = require('../db/db.js');
var LayerModel = db.LayerModel;

router.get('/layer', auth, function(req, res, next) {
	LayerModel.getLayerList(function(err,data){
		data.forEach(function(item){
			item.keywords = item.keywords.split(',')
		})
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

router.post('/layer', isAdmin, function(req, res, next) {
	LayerModel.insertLayer(req.body,function(err,layer){
		res.json({'results':layer});
	});
});

router.put('/layer/:id', isAdmin, function(req, res, next) {
	LayerModel.updateLayer(req.body,function(err,layer){
		res.json({'results':true});
	});
});

router.delete('/layer/:id', isAdmin, function(req, res, next) {
	var id = req.params.id;
	//res.json({'results':true});
	LayerModel.deleteLayer(id,function(err,layer){
		res.json({'results':true});
	});
});

module.exports = router;
