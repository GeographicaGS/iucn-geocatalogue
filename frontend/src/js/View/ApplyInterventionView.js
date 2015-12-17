'use strict';

App.View.ApplyIntervention = Backbone.View.extend({
    
    _template : _.template( $('#apply-apply_intervention_template').html() ),
    
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
            subvencion_propuesta_ite: parseFloat(this.$('input[name="subvencion_propuesta_ite"]').val().replace(/\./g,'').replace(',','.')),
            plus_porcentual: parseFloat(this.$('input[name="plus_porcentual"]').val().replace(/\./g,'').replace(',','.')),
            suplementaria: this.$('input[name="suplementaria"]:checked').val() === 'true',
            tipo_intervencion: this.$('select[name="tipo_intervencion"]').val(),
            intervention_type_name: this.$('select[name="tipo_intervencion"] option[value ="' + this.$('select[name="tipo_intervencion"]').val() + '"]').text(),
            calificacion_intervencion: this.$('input[name="calificacion_intervencion"]:checked').val(),
            gi: this.$('select[name="gi"]').val(),
            intervention_group_name: this.$('select[name="gi"] option[value ="' + this.$('select[name="gi"]').val() + '"]').attr('description'),
            descripcion_intervencion: this.$('textarea[name="descripcion_intervencion"]').val(),
        });

        var _this = this;
        this.model.url = App.config.API_URL + "/post_apply_intervention/" + this.model.get('id');
        this.model.save('', '', 
            {success: function(){
                _this.superView.closePanel($(e.currentTarget));
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