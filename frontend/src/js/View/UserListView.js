'use strict';

App.View.UserList = Backbone.View.extend({

    _template : _.template( $('#user-user_list_template').html() ),

    initialize: function() {
        App.events.trigger("menu", 3);

        this.collection = new App.Collection.Users();

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})
    },

    events: {
        "click tbody tr" : "showUser",
        "keyup .search-input" : "searchUser"
    },

    showUser:function(e){
        var id = $(e.currentTarget).attr('id');
        App.router.navigate('admin/users/' + id ,{trigger: true});
    },

    searchUser:function(e){
        var rows = this.$("tbody tr");
        var text = $(e.currentTarget).val();
        $(rows).each(function(index, value) {
            var valueText = $(value).attr('user_name');;
            if(text.length == 0 || valueText.toLowerCase().indexOf(text.toLowerCase()) != -1){
                $(value).removeClass('hide');

            }else{
                $(value).addClass('hide');
            }
        });
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        this.$el.html(this._template({
            users : this.collection.toJSON()
        }));

        return this;
    }
});
