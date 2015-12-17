'use strict';

App.View.Program = Backbone.View.extend({
    
    _template : _.template( $('#program-progam_template').html() ),
    
    initialize: function(options) {

    	this.current = options.current;

        this.collection = new App.Collection.Programs();

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})

    },

    events: {
        'click h3' : 'showList',
        'click ul li' : 'changeProgram'
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    showList:function(){
        this.$('ul').toggleClass('hide');
    },

    changeProgram: function(e){
        App.programView.current = $(e.currentTarget).attr("id");
        App.router.navigate('program/' + App.programView.current + '/applies' ,{trigger: true});
        this.map.changeProgram($(e.currentTarget).attr("id"));
    },

    setCurrent:function(current){
    	this.current = current;
    	this.render();
    },

    setMap:function(map){
        this.map = map;
    },
    
    render: function() {

    	var programs = this.collection.toJSON();

    	if(!this.current){
    		for(var i=0; i<programs.length; i++){
    			if(programs[i].is_default){
    				this.current = programs[i].id;
    				App.router.navigate('program/' + this.current + "/applies" ,{trigger: true});
    				break;
    			}
    		}
    	}

        this.$el.html(this._template({
        	current: this.current,
            programs: programs
        }));

        return this;
    },

});