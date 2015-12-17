'use strict';

App.Collection.ApplyIncidences = Backbone.Collection.extend({
	model: App.Model.ApplyIncidenceModel,
	url: App.config.API_URL + '/get_apply_incidences/',

    initialize: function(models, options) {
    },

    parse: function(response){
        return response.results;
    }

    
});