var express = require('express');
var router = express.Router();
var auth = require('../auth.js').authenticate;

var db = require('../db/db.js');
var UserModel = db.UserModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IUCN GEOCATALOGUE API' });
});

router.get('/is_logged', auth, function(req, res, next) {
	user = {
		name: req.user.name,
		profile:req.user.profile,
        surname : req.user.surname,
        username : req.user.email,
    }

    res.json(user);
});

module.exports = router;
