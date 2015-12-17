'use strict';

App.Collection.TownGeomList = Backbone.Collection.extend({
	url: App.config.API_URL + '/get_town_geom/',

    initialize: function(models, options) {
    },

    parse: function(response){
        return response.results;
    }

    
});