'use strict';

App.View.LayerList = Backbone.View.extend({

    _template : _.template( $('#layer-layer_list_template').html() ),
    _itemtemplate: _.template( $('#layer-layer_listitem_template').html() ),

    initialize: function(options) {
        App.events.trigger("menu", 1);

        // if(Map.featureIndicators){
        //     Map.getMap().setView([Map.iniLat,Map.iniLng],Map.iniZoom);
        // }

        // this.collection = new App.Collection.Layers();

        // this.listenTo(this.collection,"reset",this.render);

        // this.collection.fetch({"reset": true})
        this.collection = App.layerCollection;
        // this.listenTo(this.collection,"reset",this.render);
        
        this.collection ? this.render() : null;
    },

    events: {
        "click .application-search-btn" : "openSearch",
        "click .close-search-btn" : "closeSearch",
        "keyup .search-input" : "searchLayer",
        "click .application-table tbody tr" : "showLayer",
        "change .search-category" : "searchCategory",
        "change .search-area" : "searchArea",
        "change .search-theme" : "searchTheme",
        "change .search-subtheme" : "searchSubTheme",
        "change .search-family" : "searchFamily",
    },

    openSearch: function(e){
        this.$('.search-form-group').addClass('open');
        $(e.currentTarget).addClass('hide');
    },

    closeSearch: function(){
        this.$('.search-form-group').removeClass('open');
        this.$('.application-search-btn').removeClass('hide');
        this.renderAll();
    },

    searchLayer: function(e){
        var text = $(e.currentTarget).val().toLowerCase();
        var category = this.$('.search-category').val();
        var result;
        if(category == ''){
          result = this.collection.search(text);
        }else{
          result = this.collection.searchByField(text, category);
        }
        this.renderAll(result.toJSON());
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

    searchCategory:function(e){
        var selected = $(e.target).val();
        this.$('.search-area,.search-theme,.search-subtheme,.search-family').addClass('hide');
        this.$('.search-input').css({'visibility':'hidden'});
        if(selected ==  'department'){
            this.$('.search-area').val('').trigger('change');
            this.$('.search-area').removeClass('hide');
        }else if(selected ==  'theme'){
            this.$('.search-theme').val('').trigger('change');
            this.$('.search-theme').removeClass('hide');
        }else if(selected ==  'subtheme'){
            this.$('.search-subtheme').val('').trigger('change');
            this.$('.search-subtheme').removeClass('hide');
        }else if(selected ==  'family'){
            this.$('.search-family').val('').trigger('change');
            this.$('.search-family').removeClass('hide');
        }else{
            this.$('.search-input').css({'visibility':'visible'});
        }
    },

    searchArea:function(e){
       var selected = $(e.target).val(); 

       this.$('.search-input').val('');
       selected == '' ? 
           this.renderAll(this.collection.search('').toJSON()):
           this.renderAll(this.collection.searchByArea(selected).toJSON());
    },

    searchTheme:function(e){
       var selected = $(e.target).val(); 

       this.$('.search-input').val('');
       selected == '' ? 
           this.renderAll(this.collection.search('').toJSON()):
           this.renderAll(this.collection.searchByTheme(selected).toJSON());
    },

    searchSubTheme:function(e){
       var selected = $(e.target).val(); 

       this.$('.search-input').val('');
       selected == '' ? 
           this.renderAll(this.collection.search('').toJSON()):
           this.renderAll(this.collection.searchBySubTheme(selected).toJSON());
    },

    searchFamily:function(e){
       var selected = $(e.target).val(); 

       this.$('.search-input').val('');
       selected == '' ? 
           this.renderAll(this.collection.search('').toJSON()):
           this.renderAll(this.collection.searchByFamily(selected).toJSON());
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
      this.$el.html(this._template());
      this.$list = this.$('tbody');
      this.renderAll();
      return this;
    },

    renderAll: function(data){
      if(!data)
        data = this.collection.toJSON();
      this.$list.empty();
      var that = this;
      data.forEach(function(item){
        that.$list.append(that._itemtemplate(item));
      });
      this.$('.counter strong').text(data.length);
    }
});
