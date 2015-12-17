var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;

var db = require('../db/db.js');
var TownModel = db.TownModel;

router.get('/get_town_geom', function(req, res, next) {
	TownModel.getTownGeom(function(err,data){
		res.json({'results':data});
	});
});


module.exports = router;


