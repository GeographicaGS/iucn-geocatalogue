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
        'click .save-btn' : 'save'
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

    save:function(e){
        this.model.set({
            solicitante: this.$('input[name="solicitante"]').val(),
            // dni: this.$('input[name="dni"]').val(),
            email: this.$('input[name="email"]').val(),
            tlf: this.$('input[name="tlf"]').val(),
            sector_actividad: this.$('select[name="sector"]').val(),
            sector: this.$('select[name="sector"] option[value ="' + this.$('select[name="sector"]').val() + '"]').text(),
            promovido_por_mujer: this.$('input[name="promovido_por_mujer"]').is(':checked'),
            promovido_por_joven: this.$('input[name="promovido_por_joven"]').is(':checked'),
            g1_igualdad_h_m: this.$('input[name="g1_igualdad_h_m"]').is(':checked'),
            g2_formacion_igualdad_empleo: this.$('input[name="g2_formacion_igualdad_empleo"]').is(':checked'),
            g3_autoempleo_empleo_calidad_mujeres: this.$('input[name="g3_autoempleo_empleo_calidad_mujeres"]').is(':checked'),
            g4_conciliacion_laboral_familiar: this.$('input[name="g4_conciliacion_laboral_familiar"]').is(':checked'),
            g5_fomento_participacion_mujeres: this.$('input[name="g5_fomento_participacion_mujeres"]').is(':checked'),
            g6_conocimiento_mujeres: this.$('input[name="g6_conocimiento_mujeres"]').is(':checked'),
            g7_ocio_enfoque_genero: this.$('input[name="g7_ocio_enfoque_genero"]').is(':checked'),
            g8_otra_cat_incidencia: this.$('input[name="g8_otra_cat_incidencia"]').is(':checked'),
            j1_educacion_valores_juventud: this.$('input[name="j1_educacion_valores_juventud"]').is(':checked'),
            j2_formacion_juventud: this.$('input[name="j2_formacion_juventud"]').is(':checked'),
            j3_autoempleo_empleo_calidad_juventud: this.$('input[name="j3_autoempleo_empleo_calidad_juventud"]').is(':checked'),
            j4_participacion_juventud: this.$('input[name="j4_participacion_juventud"]').is(':checked'),
            j5_conocimiento_juventud: this.$('input[name="j5_conocimiento_juventud"]').is(':checked'),
            j6_ocio_juventud: this.$('input[name="j6_ocio_juventud"]').is(':checked'),
            j7_otra_cat_incidencia: this.$('input[name="j7_otra_cat_incidencia"]').is(':checked'),
            coord_x: this.$('input[name="coord_x"]').val(),
            coord_y: this.$('input[name="coord_y"]').val(),
            descripcion: this.$('textarea[name="descripcion"]').val(),

        });

        var _this = this;
        this.model.url = App.config.API_URL + "/post_layer_basic/" + this.model.get('id');
        this.model.save('', '',
            {success: function(){
                _this.superView.closePanel($(e.currentTarget));
                // App.mapView.resetAppliesGeoms()
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
        this.$el.html(this._template({
            layer : this.model.toJSON()
        }));
        this.$('input.hasDatePicker').datepicker({dateFormat:'dd/mm/yy'});
        return this;
    },

    _cancelMapLocation: function(){
        this.$('.getfrommap-btn').removeClass('active');
        this.$('.getfrommap-btn').text('OBTENER DEL MAPA');
        $('#map').removeClass('pointer');
        Map.getMap().off('click');
    }
});
