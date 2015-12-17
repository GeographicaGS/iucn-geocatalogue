"use strict";

var app = app || {};

App.Router = Backbone.Router.extend({

    /* define the route and function maps for this router */
     routes: {

        "" : "programDefault",

        "program/:id_program/applies" : "applyList",
        "program/:id_program/apply/:id" : "apply",
        "program/:id_program/new_apply" : "newApply",


        "program/:id_program/indicators" : "indicatorList",
        "program/:id_program/indicator/:id" : "indicator",

        "program/:id_program/admin" : "userList",
        "program/:id_program/user/:id" : "user",
        "program/:id_program/new_user" : "user",

        "layers": "layerList",
        "layers/:id_layer": "layer",
        "layers/new": "newLayer",

        "login" : "login",

        "notfound" : "notfound",
        "error" : "error",
        "*other" : "notfound",
    },

    programDefault: function(){
        App.setProgram();
    },

    applyList: function(id_program){
        App.setProgram(id_program);
        App.showView(new App.View.ApplyList({'program':id_program}));
    },

    apply: function(id_program,id){
        App.setProgram(id_program);
        App.showView(new App.View.Apply({applyId: id}));
    },

    newApply: function(id_program){
        App.setProgram(id_program);
        App.showView(new App.View.Apply({programId: id_program}));
    },

    layerList: function(){
        var id_program = 1;
        App.setProgram(id_program);
        App.showView(new App.View.LayerList({'program':id_program}));
    },

    layer: function(id){
        var id_program = 1;
        App.setProgram(id_program);
        App.showView(new App.View.Layer({layerId: id}));
    },

    newLayer: function(){
        var id_program = 1;
        App.setProgram(id_program);
        App.showView(new App.View.Layer({programId: id_program}));
    },

    indicatorList:function(id_program){
        App.setProgram(id_program);
        App.showView(new App.View.IndicatorList({'program':id_program}));
    },

    indicator:function(id_program,id){
        App.setProgram(id_program);
        App.showView(new App.View.Indicator({indicatorId: id}));
    },

    userList:function(id_program){
        App.setProgram(id_program);
        App.showView(new App.View.UserList());
    },

    user:function(id_program,id){
        App.setProgram(id_program);
        App.showView(new App.View.User({userId: id}));
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
