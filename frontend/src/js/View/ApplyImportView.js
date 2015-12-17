'use strict';

App.View.ApplyImport = Backbone.View.extend({
    
    _template : _.template( $('#apply-apply_import_template').html() ),
    
    initialize: function(options) {
        this.model = options.model
        this.superView = options.superView;
        this.render();
    },

    events: {
        'click .cancel-btn' : 'cancelEdit',
        'click .save-btn' : 'save'
    },

    save:function(e){
        this.model.set({
            inversion_prevista: parseFloat(this.$('input[name="inversion_prevista"]').val().replace(/\./g,'').replace(',','.')),
            presupuesto_solicitud: parseFloat(this.$('input[name="presupuesto_solicitud"]').val().replace(/\./g,'').replace(',','.')),
            inversion_subvencionable: parseFloat(this.$('input[name="inversion_subvencionable"]').val().replace(/\./g,'').replace(',','.')),
            subvencion_solicitada: parseFloat(this.$('input[name="subvencion_solicitada"]').val().replace(/\./g,'').replace(',','.')),
            inversion_en_contrato: parseFloat(this.$('input[name="inversion_en_contrato"]').val().replace(/\./g,'').replace(',','.')),
            subvencion_concedida: parseFloat(this.$('input[name="subvencion_concedida"]').val().replace(/\./g,'').replace(',','.')),
            subvencion_concedida_condicionada: parseFloat(this.$('input[name="subvencion_concedida_condicionada"]').val().replace(/\./g,'').replace(',','.')),
            anyadir_gi: parseFloat(this.$('input[name="anyadir_gi"]').val().replace(/\./g,'').replace(',','.'))
        }); 

        var _this = this;
        this.model.url = App.config.API_URL + "/post_apply_import/" + this.model.get('id');
        this.model.save('', '', 
            {success: function(){
                _this.superView.closePanel($(e.currentTarget));
                _this.superView.refreshImports(_this.model.get('inversion_prevista'), _this.model.get('subvencion_concedida'));
                _this.render();
            }
        });
    },

    cancelEdit:function(){
        this.superView.closePanel(this.$('.cancel-btn'));
        this.render();
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            apply : this.model.toJSON()
        }));
        return this;
    }
});