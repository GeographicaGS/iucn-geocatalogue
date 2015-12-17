'use strict';

App.Collection.Users = Backbone.Collection.extend({
	model: App.Model.UserModel,
	url: App.config.API_URL + '/get_user_list/',

    initialize: function(models, options) {
    },

    parse: function(response){
        return response.results;
    }

    
});