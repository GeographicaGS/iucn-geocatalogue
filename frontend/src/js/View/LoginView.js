'use strict';

App.View.Login = Backbone.View.extend({
    
    _template : _.template( $('#login-login_template').html() ),
    
    initialize: function() {
        this.render();
    },

    events: {
        "click .login-btn" : "doLogin"
    },

    doLogin: function(e){
        e.preventDefault();
        App.doLogin({
            username: this.$("input[id='userName']").val(),
            password: md5(this.$("input[id='userPassword']").val())
        });
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
});