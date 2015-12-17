'use strict';

App.Collection.Applies = Backbone.Collection.extend({
	
	url: App.config.API_URL + '/get_apply_list/',

    initialize: function(models, options) {
    	
    },

    // url : function() {
    //     return App.config.API_URL + '/get_apply_list';
    // },

    parse: function(response){
        return response.results;
    }

    
});