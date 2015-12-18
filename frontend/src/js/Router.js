"use strict";

var app = app || {};

App.Router = Backbone.Router.extend({

    /* define the route and function maps for this router */
     routes: {

        "" : "layerList",

        "admin" : "userList",
        "admin/users/:id_user" : "user",
        "admin/newuser" : "newUser",

        "layers": "layerList",
        "layers/:id_layer": "layer",
        "newlayer": "newLayer",

        "login" : "login",

        "notfound" : "notfound",
        "error" : "error",
        "*other" : "notfound",
    },

    layerList: function(){
        var id_program = 1;
        App.showView(new App.View.LayerList({'program':id_program}));
    },

    layer: function(id){
        App.showView(new App.View.Layer({layerId: id}));
    },

    newLayer: function(){
        var id_program = 1;
        App.showView(new App.View.Layer({programId: id_program}));
    },

    userList:function(){
        App.showView(new App.View.UserList());
    },

    user:function(id_user){
        App.showView(new App.View.User({userId: id_user}));
    },

    newUser:function(){
        App.showView(new App.View.User());
    },

    login: function(){
        App.showView(new App.View.Login());
    },

    notfound: function(){
        App.showView(new App.View.NotFound());
    },

    error: function(){
        App.showView(new App.View.Error());
        //localStorage.clear();
        //window.location.href = "/login"
    }

});
