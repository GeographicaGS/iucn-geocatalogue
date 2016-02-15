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
	},

	search: function(term){
		if(!term) return this;
		var filtered = [];
		this.each(function(item){
			var result = item.get('name').toLowerCase().indexOf(term) > -1 ||
			item.get('id_code_num').toLowerCase().indexOf(term) > -1 ||
			item.get('theme').toLowerCase().indexOf(term) > -1 ||
			item.get('subtheme').toLowerCase().indexOf(term) > -1 ||
			item.get('family').toLowerCase().indexOf(term) > -1 ||
			item.get('department').toLowerCase().indexOf(term) > -1;
			if(!result){
				item.get('keywords').forEach(function(el){
					result = result || el.toLowerCase().indexOf(term) > -1;
				});
			}
			if(result){
				filtered.push(item);
			}
		});
		return new App.Collection.Layers(filtered);
	},

	searchByField: function(term, category){
		if(!term) return this;
		var filtered = [];
		this.each(function(item){
			var value = item.get(category);
			if (value){
				if(typeof(value)==='object'){
					value = value.toString();
				}
				if (value.toLowerCase().indexOf(term) > -1){
					filtered.push(item);
				}
			}
		});
		return new App.Collection.Layers(filtered);
	},

	searchByArea: function(area){
		var filtered = [];
		this.each(function(item){
			if(item.get('department').indexOf(area) > -1){
				filtered.push(item);
			}
		});
		return new App.Collection.Layers(filtered);
	},

	searchByTheme: function(area){
		var filtered = [];
		this.each(function(item){
			if(item.get('theme').indexOf(area) > -1){
				filtered.push(item);
			}
		});
		return new App.Collection.Layers(filtered);
	},

	searchBySubTheme: function(area){
		var filtered = [];
		this.each(function(item){
			if(item.get('subtheme').indexOf(area) > -1){
				filtered.push(item);
			}
		});
		return new App.Collection.Layers(filtered);
	},

	searchByFamily: function(area){
		var filtered = [];
		this.each(function(item){
			if(item.get('family').indexOf(area) > -1){
				filtered.push(item);
			}
		});
		return new App.Collection.Layers(filtered);
	}
});
