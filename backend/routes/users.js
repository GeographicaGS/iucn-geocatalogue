var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;
var isAdmin = require('../auth.js').isAdmin;

var db = require('../db/db.js');
var UserModel = db.UserModel;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/get_user_list', isAdmin, function(req, res, next) {
	UserModel.getUserList(function(err,data){
		res.json({'results':data});
	});
});

router.get('/user/:id', isAdmin, function(req, res, next) {
	var id = req.params.id;
	UserModel.getUserInfo(id,function(err,user){
		res.json(user[0]);
	});
});


router.put('/post_edit_user', isAdmin, function(req, res, next) {
	UserModel.updateUser(req.body,function(err,user){
		res.json({'results':true});
	});
});


router.post('/post_new_user', isAdmin, function(req, res, next) {
	UserModel.createUser(req.body,function(err,user){
		res.json({'results':true});
	});
});


router.delete('/remove_user/:id', isAdmin, function(req, res, next) {
	var id = req.params.id;
	UserModel.removeUser(id,function(err,user){
		res.json({'results':true});
	});
});

module.exports = router;
