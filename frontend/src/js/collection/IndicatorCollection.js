'use strict';

App.Collection.Indicators = Backbone.Collection.extend({
	
	url: App.config.API_URL + '/get_indicator_list/',

    initialize: function(models, options) {
    	
    },

    // url : function() {
    //     return App.config.API_URL + '/get_indicator_list';
    // },

    parse: function(response){
        return response.results;
    }

    
});