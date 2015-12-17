'use strict';

App.View.IndicatorList = Backbone.View.extend({
    
    _template : _.template( $('#indicator-indicator_list_template').html() ),
    
    initialize: function(options) {
        App.events.trigger("menu", 2);
        if(Map.featureIndicators){
            Map.getMap().setView([Map.iniLat,Map.iniLng],Map.iniZoom);
            Map.featureIndicators.clearLayers();
        }
        this.collection = new App.Collection.Indicators();

        this.collection.url = this.collection.url + options.program

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})
    },

    events: {
        "keyup .search-input" : "searchIndicator",
        "click .list-items li" : "showIndicator"
    },

    searchIndicator:function(e){
        var rows = this.$(".list-items li");
        var text = $(e.currentTarget).val();
        $(rows).each(function(index, value) {
            var valueText = $(value).text();
            if(text.length == 0 || valueText.toLowerCase().indexOf(text.toLowerCase()) != -1){
                $(value).removeClass('hide');

            }else{
                $(value).addClass('hide');
            }
        });
    },

    showIndicator:function(e){
        var id = $(e.currentTarget).attr('id');
        App.router.navigate('program/' + App.programView.current + '/indicator/' + id ,{trigger: true});
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            indicators : this.collection.toJSON()
        }));

        return this;
    }
});