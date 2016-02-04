'use strict';

App.View.User = Backbone.View.extend({

    _template : _.template( $('#user-user_template').html() ),
    _template_new_user : _.template( $('#user-new_user_template').html() ),

    initialize: function(options) {
        var options = options || {};
        App.events.trigger("menu", 3);

        this.model = new App.Model.UserModel();
        if(options.userId){
            this.model.url = this.model.url + options.userId

            this.listenTo(this.model,"change:id",this.render);

            this.model.fetch({"reset": true})

        }else{
            this.renderNewUser();
        }
    },

    events: {
        "click .edit-btn" : "editUser",
        "click .cancel-btn" : "cancelEdit",
        "click .save-btn" : "save",
        "click .delete-btn" : "delete",
    },

    editUser:function(){
        this.$('.user-edit ').addClass('edit-on');
    },

    cancelEdit:function(){
        this.$('.user-edit ').removeClass('edit-on');
    },

    save:function(e){

        var _this = this;
        var error = false;

        this.$('input').removeClass('error');
        error += App.checkInputByName(this,"name");
        error += App.checkInputByName(this,"surname");
        error += App.checkInputByName(this,"email");
        error += App.checkInputByName(this,"password");

        if(!error){

            this.model.set({
                name: this.$('input[name="name"]').val(),
                surname: this.$('input[name="surname"]').val(),
                email: this.$('input[name="email"]').val(),
                password: md5(this.$('input[name="password"]').val()),
                id_profile: this.$('select[name="profile"]').val(),
                profile: this.$('select[name="profile"] option:selected').text()
            });

            if(!this.model.get("id")){

                this.model.url = App.config.API_URL + "/post_new_user";
                this.model.save('', '',
                    {success: function(){
                        App.router.navigate('admin', {trigger: true});
                    }
                });

            }else{

                this.model.url = App.config.API_URL + "/post_edit_user";
                this.model.save('', '',
                    {success: function(){
                        _this.render();
                    }
                });
            }
        }

    },

    delete:function(){
        var _this = this;
        _this.model.url = App.config.API_URL + '/remove_user/' + _this.model.get('id');
        var c = confirm("¿Esta seguro de que desea eliminar este usuario?");
        if(c){
            _this.model.destroy({
                success:function(){
                    App.router.navigate('admin' ,{trigger: true});
                }
            });
        }
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        this.$el.html(this._template({
            user: this.model.toJSON()
        }));

        return this;
    },

    renderNewUser:function(){
        this.$el.html(this._template_new_user());

        return this;

    }

});
