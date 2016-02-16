'use strict';

App.View.LayerBasicInformation = Backbone.View.extend({

    _template : _.template( $('#layer-layer_basic_information_template').html() ),

    initialize: function(options) {
        this.model = options.model
        this.superView = options.superView;
        this.render();
    },

    events: {
        'click .getfrommap-btn' : 'getMapLocation',
        'click .cancel-btn' : 'cancelEdit',
        'click .save-btn' : 'save',

        'change #layerDepartmentSelectEdit': 'changeDepartmentSelect',
        'change #layerThemeSelectEdit': 'changeThemeSelect',
        'change #layerSubthemeSelectEdit': 'chengeSubthemeSelect',
        'change #layerFamilySelectEdit': 'chengeFamilySelect',
    },

    getMapLocation: function(e){
        $(e.currentTarget).toggleClass('active');
        $('#map').toggleClass('pointer');
        var _this = this;
        if($(e.currentTarget).hasClass('active')){
            $(e.currentTarget).text('Cancelar');
            Map.getMap().on('click', function(e) {
                _this.$('.corX input').val(e.latlng.lng);
                _this.$('.corY input').val(e.latlng.lat);
                _this._cancelMapLocation();
            });
        }else{
            this._cancelMapLocation();
        }
    },

    changeDepartmentSelect:function(e){
        this.$('#layerDepartment').val($(e.target).val());
    },

    changeThemeSelect:function(e){
        this.$('#layerTheme').val($(e.target).val());
    },

    chengeSubthemeSelect:function(e){
        this.$('#layerSubtheme').val($(e.target).val());
    },

    chengeFamilySelect:function(e){
        this.$('#layerFamily').val($(e.target).val());
    },

    save:function(e){
        var keywords = [];
        $('input[name="keyword"]').each(function(){
          keywords.push($(this).val());
        });

        var layer_creation = this.$('input[name="layer_creation"]').val();
        var layer_update = this.$('input[name="layer_update"]').val();

        this.model.set({
          id_code_num: this.$('input[name="id_code_num"]').val(),
          name: this.$('input[name="name"]').val(),
          department: this.$('input[name="department"]').val(),
          theme: this.$('input[name="theme"]').val(),
          subtheme: this.$('input[name="subtheme"]').val(),
          family: this.$('input[name="family"]').val(),
          summary: this.$('textarea[name="summary"]').val(),
          filetype: this.$('input[name="filetype"]').val(),
          crs: this.$('input[name="crs"]').val(),
          extension: this.$('select[name="extension"]').val(),
          //bounding_box: this.$('input[name="bounding_box"]').val(),
          scale: this.$('input[name="scale"]').val(),
          // review_date: this.$('input[name="review_date"]').val(),
          review_date: new Date(),
          // edition_date: this.$('input[name="edition_date"]').val(),
          project_name: this.$('input[name="project_name"]').val(),
          source: this.$('input[name="source"]').val(),
          publication: this.$('input[name="publication"]').val(),
          link: this.$('input[name="link"]').val(),
          data_responsible: this.$('input[name="data_responsible"]').val(),
          metadata_responsible: this.$('input[name="metadata_responsible"]').val(),
          language: this.$('input[name="language"]').val(),
          access_limitation: this.$('textarea[name="access_limitation"]').val(),
          other_info: this.$('textarea[name="other_info"]').val(),

          layer_creation: layer_creation == "" ? null : layer_creation,
          layer_update: layer_update == "" ? null : layer_update,
          
          keywords: keywords
        });

        var _this = this;
        this.model.url = App.config.API_URL + "/layer/" + this.model.get('id');
        this.model.save('', '',
            {success: function(){
                _this.superView.closePanel($(e.currentTarget));
                _this.superView.render();
                _this.render();
            }
        });
    },

    cancelEdit:function(){
        if(this.$('.getfrommap-btn').hasClass('active')){
            this._cancelMapLocation();
        }
        this.superView.closePanel(this.$('.cancel-btn'));
        this.render();
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        var layer= this.model.toJSON();
        this.$el.html(this._template({
            layer : layer
        }));
        var edition_date = new Date(layer.edition_date);
        this.$('#layerEditiondate').val(edition_date.toLocaleDateString());
        this.$('#layerEditiondate + span').html(edition_date.toLocaleDateString());
        var review_date = new Date(layer.review_date);
        this.$('#layerReviewdate').val(review_date.toLocaleDateString());
        this.$('#layerReviewdate + span').html(review_date.toLocaleDateString());
        return this;
    },

    _cancelMapLocation: function(){
        this.$('.getfrommap-btn').removeClass('active');
        this.$('.getfrommap-btn').text('OBTENER DEL MAPA');
        $('#map').removeClass('pointer');
        Map.getMap().off('click');
    }
});
