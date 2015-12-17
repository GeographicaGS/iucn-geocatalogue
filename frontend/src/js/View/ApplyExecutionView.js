'use strict';

App.View.ApplyExecution = Backbone.View.extend({
    
    _template : _.template( $('#apply-apply_execution_template').html() ),
    
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
            
            fechalimite_inicio: this.$('input[name="fechalimite_inicio"]').val(),
            fechalimite_finalizacion: this.$('input[name="fechalimite_finalizacion"]').val(),
            normas_competencia: this.$('textarea[name="normas_competencia"]').val(),
            
        });
        
        var _this = this;
        this.model.url = App.config.API_URL + "/post_apply_execute/" + this.model.get('id');
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

        this.$('input[name="fechalimite_inicio"]').datepicker({dateFormat:'dd/mm/yy'});
        this.$('input[name="fechalimite_finalizacion"]').datepicker({dateFormat:'dd/mm/yy'});
        
        return this;
    }
});