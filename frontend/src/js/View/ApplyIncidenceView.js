'use strict';

App.View.ApplyIncidence = Backbone.View.extend({
    
    _template : _.template( $('#apply-apply_incidence_template').html() ),
    
    initialize: function(options) {
    	this.id_apply = options.id_apply
    	this.collection = new App.Collection.ApplyIncidences();
    	this.collection.url = this.collection.url + this.id_apply

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true});
    },

    events: {
		"click .add-comment-btn" : "addIncidence",
		"click .close-btn" : "deleteIncidence",
    },

    addIncidence:function(){
    	var _this = this;
    	var incidence = new App.Model.ApplyIncidenceModel({user:App.user.username, description:this.$('.add-comment-text').val(), apply:this.id_apply});
    	incidence.save('', '', 
            {success: function(){
                _this.collection.fetch({"reset": true});
            }
        });
    },

    deleteIncidence:function(e){
    	var _this = this;
    	var incidence = this.collection.findWhere({id:parseInt($(e.currentTarget).attr('incidence'))});
    	incidence.url = App.config.API_URL + '/remove_apply_incidence/' + incidence.get('id');
    	var c = confirm("¿Está seguro de que desea borrar esta incidencia?");
    	if(c){
    		incidence.destroy({
    			success:function(){
    				_this.collection.fetch({"reset": true});
    			}
    		});
    	}
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            incidences : this.collection.toJSON()
        }));

        return this;
    }
});