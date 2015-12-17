'use strict';

App.View.Layer = Backbone.View.extend({

    _template : _.template( $('#layer-layer_template').html() ),
    _new_layer_template : _.template( $('#layer-new_layer_template').html() ),

    initialize: function(options) {
        App.events.trigger("menu", 1);
        this.model = new App.Model.LayerModel();

        if(options.layerId){
            this.model.url = this.model.url + options.layerId
            this.listenTo(this.model,"change:id",this.render);

        }else if(options.programId){
            this.model.url = this.model.url + 'program/' + options.programId
            this.listenTo(this.model,"sync",this.renderNew);
        }

        this.model.fetch({"reset": true})
    },

    events: {
        "click .panel-toggle" : "expandPanel",
        "click .edit-btn" : "activateEdit",
        'click .new-getfrommap-btn' : 'getMapLocation',
        'click #create-new-btn' : 'createLayer',
        'click .state li' : 'changeState',

        // "click .cancel-btn" : "cancelEdit",
        // "click .save-btn" : "save"
    },

    expandPanel: function(e){
        $(e.currentTarget).closest('.panel-item').toggleClass('expanded');
    },

    activateEdit: function(e){
        $(e.currentTarget).closest('.panel-item').addClass('edit-on');
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

    createLayer:function(){
        var error = false;

        this.$('.error').removeClass('error');
        error = App.checkInputByName(this,"denominacion");
        error += App.checkInputByName(this,"solicitante");
        error += App.checkInputByName(this,"coord_x");
        error += App.checkInputByName(this,"coord_y");

        if(!error){
            var id_program = this.model.get('id_program');
            this.model = new App.Model.LayerModel();

            this.model.set({
                denominacion: this.$('input[name="denominacion"]').val(),
                solicitante: this.$('input[name="solicitante"]').val(),
                municipio: this.$('select[name="municipio"]').val(),
                gi: this.$('select[name="gi"]').val(),
                coord_x: this.$('input[name="coord_x"]').val(),
                coord_y: this.$('input[name="coord_y"]').val(),
                observaciones: this.$('textarea[name="observaciones"]').val(),
                id_program: id_program
            });

            this.model.url = App.config.API_URL + '/post_new_layer'

            var _this = this;
            this.model.save('', '',
                {success: function(model,response){
                    App.router.navigate('program/' + App.programView.current + '/layer/' + response.results.id ,{trigger: true});
                    // App.mapView.resetAppliesGeoms()
                }
            });

        }
    },

    changeState:function(e){
        this.model.set('estado', $(e.currentTarget).attr('state'))
        var _this = this;
        $.ajax({
            url: App.config.API_URL + '/change_state/' + this.model.get('id'),
            type: "POST",
            data:{state:this.model.get('estado')},
            dataType: "json",
            success: function(response) {
                _this.render();
                // App.mapView.resetAppliesGeoms()
            }
        });
    },


    // cancelEdit: function(e){
    //     $(e.currentTarget).closest('.panel-item').removeClass('edit-on');
    // },

    // save: function(e){
    //     $(e.currentTarget).closest('.panel-item').removeClass('edit-on');
    // },

    onClose: function(){
        // Remove events on close
        if(this.model.get('solicitud')){
            this.basicInformationView.close();
            this.interventionView.close();
            this.importView.close();
            this.executionView.close();
        }

        this.stopListening();
    },

    render: function() {
        this.basicInformationView = new App.View.LayerBasicInformation({model: this.model, superView:this});

        this.$el.html(this._template({
            layer : this.model.toJSON()
        }));

        this.$('#basic_information').append(this.basicInformationView.el);

        return this;
    },

    renderNew: function(){
        this.$el.html(this._new_layer_template({
            layer : this.model.toJSON()
        }));
    },

    closePanel:function(elem){
        $(elem).closest('.panel-item').removeClass('edit-on');
    },

    refreshImports:function(inversion_prevista, subvencion_concedida){
        this.$('#plannedInvestment').text(App.formatNumber(inversion_prevista) + ' ' + '€');
        this.$('#subventionGrant').text(App.formatNumber(subvencion_concedida) + ' ' + '€');
    },

    _cancelMapLocation: function(){
        this.$('.new-getfrommap-btn').removeClass('active');
        this.$('.new-getfrommap-btn').text('OBTENER DEL MAPA');
        $('#map').removeClass('pointer');
        Map.getMap().off('click');
    }
});
