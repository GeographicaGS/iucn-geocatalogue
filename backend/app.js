var express = require('express');
var config = require('./config');

var app = express();
var db = require("./db/db");

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "auth-hash,auth-username,auth-timestamp,Content-Type");
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
    next();
});

db.init(function(err){
    if (err){
        throw err;
    }

    var path = require('path');
    var logger = require('morgan');
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');
    var index = require('./routes/index');
    var apply = require('./routes/apply');
    var layer = require('./routes/layer');
    var indicator = require('./routes/indicator');
    var users = require('./routes/users');
    var program = require('./routes/program');
    var town = require('./routes/town');
    var url = require('url');

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    console.log("Environment: " + app.get('env'));

    if (app.get('env') === 'development') {
        app.use("/js",express.static(path.join(__dirname, 'js')));
        app.use("/lib",express.static(path.join(__dirname, 'lib')));
    }
    else{
        var buildFolder = path.join(__dirname,'js-built');

        var fs = require('fs');

        if (!fs.existsSync(buildFolder)) {
            fs.mkdirSync(buildFolder);
        }

        app.use("/js",express.static(buildFolder));
        app.use("/lib",express.static(path.join(__dirname, 'lib')));
    }

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/', index);
    app.use('/', apply);
    app.use('/', layer);
    app.use('/', indicator);
    app.use('/', users);
    app.use('/', program);
    app.use('/', town);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {

        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            data = {
                message: err.message,
                error: err
            };

            console.log(data);
            res.render('error', data);
        });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


});

module.exports = app;
