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
            this.model.fetch({"reset": true});
        }else if(options.programId){
            this.renderNew();
        }
    },

    events: {
        'click .panel-toggle' : 'expandPanel',
        'click .edit-btn' : 'activateEdit',
        'click #create-new-btn' : 'createLayer',
        'click .state li' : 'changeState',
        'click #addKeyword' : 'addKeyword',
        'click .delkw': 'removeKeyword',
        'click .delete-btn' : 'delete',
        'click .copytoclipboard': 'copyLinkToClipboard',
        'change #layerDepartmentSelect': 'clickDepartmentSelect',

        'change #layerThemeSelect': 'clickThemeSelect',
        'change #layerSubthemeSelect': 'clickSubthemeSelect',
        'change #layerFamilySelect': 'clickFamilySelect',

        // "click .cancel-btn" : "cancelEdit",
       // "click .save-btn" : "save"
    },

    clickDepartmentSelect:function(e){
        this.$('#layerDepartment').val($(e.target).val());
    },

    clickThemeSelect:function(e){
        this.$('#layerTheme').val($(e.target).val());
    },

    clickSubthemeSelect:function(e){
        this.$('#layerSubtheme').val($(e.target).val());
    },

    clickFamilySelect:function(e){
        this.$('#layerFamily').val($(e.target).val());
    },

    expandPanel: function(e){
        $(e.currentTarget).closest('.panel-item').toggleClass('expanded');
    },

    activateEdit: function(e){
        $(e.currentTarget).closest('.panel-item').addClass('edit-on');
    },

    createLayer:function(){
        var error = false;

        this.$('.error').removeClass('error');
        error = App.checkInputByName(this,"name");
        error += App.checkInputByName(this,"department");
        error += App.checkInputByName(this,"theme");
        error += App.checkInputByName(this,"filetype");
        error += App.checkInputByName(this,"crs");
        error += App.checkInputByName(this,"extension");
        error += App.checkInputByName(this,"review_date");
        error += App.checkInputByName(this,"edition_date");
        error += App.checkInputByName(this,"summary");
        error += App.checkInputByName(this,"project_name");
        error += App.checkInputByName(this,"source");
        error += App.checkInputByName(this,"link");
        error += App.checkInputByName(this,"data_responsible");
        error += App.checkInputByName(this,"metadata_responsible");
        error += App.checkInputByName(this,"language");
        error += App.checkInputByName(this,"access_limitation");
        error += App.checkInputByName(this,"layer_creation");
        error += App.checkInputByName(this,"layer_update");

        if(!error){
            var id_program = this.model.get('id_program');
            this.model = new App.Model.LayerModel();

            var keywords = [];
            $('input[name="keyword"]').each(function(){
              keywords.push($(this).val());
            })

            this.model.set({
                // id_code_num: this.$('input[name="id_code_num"]').val(),
                name: this.$('input[name="name"]').val(),
                department: this.$('input[name="department"]').val(),
                theme: this.$('input[name="theme"]').val(),
                subtheme: this.$('input[name="subtheme"]').val(),
                family: this.$('input[name="family"]').val(),
                summary: this.$('textarea[name="summary"]').val(),
                filetype: this.$('input[name="filetype"]').val(),
                crs: this.$('input[name="crs"]').val(),
                extension: this.$('select[name="extension"]').val(),
                bounding_box: this.$('input[name="bounding_box"]').val(),
                scale: this.$('input[name="scale"]').val(),
                review_date: this.$('input[name="review_date"]').val(),
                edition_date: this.$('input[name="edition_date"]').val(),
                project_name: this.$('input[name="project_name"]').val(),
                source: this.$('input[name="source"]').val(),
                publication: this.$('input[name="publication"]').val(),
                link: this.$('input[name="link"]').val(),
                data_responsible: this.$('input[name="data_responsible"]').val(),
                metadata_responsible: this.$('input[name="metadata_responsible"]').val(),
                language: this.$('input[name="language"]').val(),
                access_limitation: this.$('textarea[name="access_limitation"]').val(),
                other_info: this.$('textarea[name="other_info"]').val(),

                layer_creation: this.$('input[name="layer_creation"]').val(),
                layer_update: this.$('input[name="layer_update"]').val(),

                keywords: keywords
            });

            this.model.url = App.config.API_URL + '/layer'

            var _this = this;
            this.model.save('', '',
                {success: function(model,response){
                    _this.model.set('id', response.results.id);
                    _this.model.set('id_code_num', response.results.id_code_num);
                    App.layerCollection.add(_this.model);
                    App.router.navigate('/layers/' + response.results.id ,{trigger: true});
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

        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        var layer_creation = this.model.get('layer_creation') ? this.model.get('layer_creation').replace(pattern,'$3-$2-$1') : '';
        var layer_update = this.model.get('layer_update') ? this.model.get('layer_update').replace(pattern,'$3-$2-$1') : '';

        this.$('#layerCreation').datepicker({ dateFormat:'dd/mm/yy'}).datepicker("setDate", (layer_creation ? new Date(layer_creation):'' ));;
        this.$('#layerUpdate').datepicker({ dateFormat:'dd/mm/yy' }).datepicker("setDate", (layer_update ? new Date(layer_update) : '' ));

        return this;
    },

    renderNew: function(){
        this.$el.html(this._new_layer_template({
            layer : this.model.toJSON()
        }));
        var today = new Date();
        var todayStr = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        this.$('input#layerEditiondate').val(today.toJSON());
        this.$('input#layerReviewdate').val(today.toJSON());

        this.$('.datepicker').datepicker({ dateFormat:'dd/mm/yy' });
    },

    closePanel:function(elem){
        $(elem).closest('.panel-item').removeClass('edit-on');
    },

    refreshImports:function(inversion_prevista, subvencion_concedida){
        this.$('#plannedInvestment').text(App.formatNumber(inversion_prevista) + ' ' + '€');
        this.$('#subventionGrant').text(App.formatNumber(subvencion_concedida) + ' ' + '€');
    },

    addKeyword: function(e){
      e.preventDefault();
      var $target = $('#layerKeywords ul');
      if ($target.length === 0) $target = $('#layerKeywords');
      $target.append($('<li><input placeholder="Write another keyword" type="text" class="keyword edit" name="keyword" maxlength="100"><a href="#" class="delkw">Delete</a></li>'));
    },

    removeKeyword: function(e){
      e.preventDefault();
      var $target = $(e.currentTarget);
      $target.parent().remove();
    },

    delete: function(){
        var r = confirm('Are you sure?');
        if (r){
            App.layerCollection.remove(this.model);
            this.model.destroy({ success: function(model, response) {
                App.router.navigate('layers',{trigger:true});
            }});
        }
    },

    copyLinkToClipboard: function(e){
      e.preventDefault();
      var link = e.currentTarget.href;
      var $dummyTextArea = $('<textarea style="position:absolute;opacity:0;">' + link + '</textarea>');
      $('body').append($dummyTextArea);
      $dummyTextArea[0].select();
      try {
        var successful = document.execCommand('copy');
        if(successful){
          alert('The file path was succesfully copied to the clipboard. Please, open a new tab and paste it to access to the file.');
        }else{
          alert('There was an error copying the file path to the clipboard. Please, try again or copy it manually.');
        }
      } catch (err) {
        alert('There was an error copying the file path to the clipboard. Please, try again or copy it manually.');
      }
      $dummyTextArea.remove();
    }
});
