'use strict';

App.View.Map = Backbone.View.extend({
	
    initialize: function(options) {
    	Map.initialize();

        this.collection = new App.Collection.AppliesGeomList();
        this.collection.url = this.collection.root_url + options.idProgram
        this.listenTo(this.collection,"reset",this.render);


        this.townCollection = new App.Collection.TownGeomList();
        this.listenTo(this.townCollection,"reset",this.renderTowns);
        this.townCollection.fetch({"reset": true})

        this.resetAppliesGeoms();
        
    },

    resetAppliesGeoms:function(){
        this.collection.fetch({"reset": true})
    },

    changeProgram:function(id_program){
        this.collection.url = this.collection.root_url + id_program;
        this.resetAppliesGeoms();
    },
    
    onClose: function(){
    },
    
    render: function() {

        Map.drawApplies(this.collection.toJSON());

        return this;
    }, 

    renderTowns: function(){

        Map.drawTowns(this.townCollection.toJSON());

        return this;
    }   
});

	