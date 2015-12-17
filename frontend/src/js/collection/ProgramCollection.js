'use strict';

App.Collection.Programs = Backbone.Collection.extend({
	url: App.config.API_URL + '/get_progam_list/',

    initialize: function(models, options) {
    },

    parse: function(response){
        return response.results;
    }

    
});