'use strict';

App.View.Apply = Backbone.View.extend({
    
    _template : _.template( $('#apply-apply_template').html() ),
    _new_apply_template : _.template( $('#apply-new_apply_template').html() ),
    
    initialize: function(options) {
        App.events.trigger("menu", 1);
        this.model = new App.Model.ApplyModel();

        if(options.applyId){
            this.model.url = this.model.url + options.applyId
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
        'click #create-new-btn' : 'createApply',
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

    createApply:function(){
        var error = false;

        this.$('.error').removeClass('error');
        error = App.checkInputByName(this,"denominacion");
        error += App.checkInputByName(this,"solicitante");
        error += App.checkInputByName(this,"coord_x");
        error += App.checkInputByName(this,"coord_y");

        if(!error){
            var id_program = this.model.get('id_program');
            this.model = new App.Model.ApplyModel();

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

            this.model.url = App.config.API_URL + '/post_new_apply'

            var _this = this;
            this.model.save('', '', 
                {success: function(model,response){
                    App.router.navigate('program/' + App.programView.current + '/apply/' + response.results.id ,{trigger: true});
                    App.mapView.resetAppliesGeoms()
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
                App.mapView.resetAppliesGeoms()
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
        this.basicInformationView = new App.View.ApplyBasicInformation({model: this.model, superView:this});
        this.interventionView = new App.View.ApplyIntervention({model: this.model, superView:this });
        this.importView = new App.View.ApplyImport({model: this.model, superView:this });
        this.executionView = new App.View.ApplyExecution({model: this.model, superView:this });
        this.incidenceView = new App.View.ApplyIncidence({id_apply: this.model.get('id')});
        
        this.$el.html(this._template({
            apply : this.model.toJSON()
        }));

        this.$('#basic_information').append(this.basicInformationView.el);
        this.$('#intervention').append(this.interventionView.el);
        this.$('#import').append(this.importView.el);
        this.$('#execution').append(this.executionView.el);
        this.$('#apply_incidences').append(this.incidenceView.el);

        return this;
    },

    renderNew: function(){
        this.$el.html(this._new_apply_template({
            apply : this.model.toJSON()
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