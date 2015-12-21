'use strict';

App.Collection.Layers = Backbone.Collection.extend({

	url: App.config.API_URL + '/layer/',

    initialize: function(models, options) {

    },

    // url : function() {
    //     return App.config.API_URL + '/get_apply_list';
    // },

    parse: function(response){
        return response.results;
    }


});
