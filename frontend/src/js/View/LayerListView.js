'use strict';

App.View.LayerList = Backbone.View.extend({

    _template : _.template( $('#layer-layer_list_template').html() ),

    initialize: function(options) {
        App.events.trigger("menu", 1);

        if(Map.featureIndicators){
            Map.getMap().setView([Map.iniLat,Map.iniLng],Map.iniZoom);
        }

        this.collection = new App.Collection.Layers();

        // this.collection.url = this.collection.url + options.program

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})
        // this.render();
    },

    events: {
        "click .application-search-btn" : "openSearch",
        "click .close-search-btn" : "closeSearch",
        "keyup .search-input" : "searchLayer",
        "click .application-table tbody tr" : "showLayer"
    },

    openSearch: function(e){
        this.$('.search-form-group').addClass('open');
        $(e.currentTarget).addClass('hide');
    },

    closeSearch: function(){
        this.$('.search-form-group').removeClass('open');
        this.$('.application-search-btn').removeClass('hide');
    },

    searchLayer: function(e){
        var rows = this.$(".application-table tr");
        var text = $(e.currentTarget).val();
        $(rows).each(function(index, value) {
            if($(value).find('span.denomination').length > 0 && $(value).find('span.number').length > 0){
                var denomination = $(value).find('span.denomination').text().toLowerCase();
                var number = $(value).find('span.number').text().toLowerCase();
                if(text.length == 0
                    || denomination.indexOf(text.toLowerCase()) != -1
                    || number.indexOf(text.toLowerCase()) != -1
                    || (number + denomination).replace(/ /g,'').indexOf(text.toLowerCase().replace(/ /g,'')) != -1){

                    $(value).removeClass('hide');
                }else{
                    $(value).addClass('hide');
                }
            }
        });
    },

    showLayer:function(e){
        var id = $(e.currentTarget).data('layer');
        App.router.navigate('layers/' + id ,{trigger: true});
        // var model = this.collection.findWhere({id: parseInt(id)});
        // var x = model.get('coord_x');
        // var y = model.get('coord_y');
        // var mx = model.get('coord_x_m');
        // var my = model.get('coord_y_m');
        // if(!x || !y){
        //     x = mx;
        //     y = my;
        // }
        // Map.getMap().setView([y,x],18);

    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        this.$el.html(this._template({
            layers : this.collection.toJSON()
        }));

        return this;
    }
});
