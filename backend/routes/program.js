var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;

var db = require('../db/db.js');
var ProgramModel = db.ProgramModel;

router.get('/get_progam_list', auth, function(req, res, next) {
	ProgramModel.getProgramList(function(err,data){
		res.json({'results':data});
	});
});


module.exports = router;


