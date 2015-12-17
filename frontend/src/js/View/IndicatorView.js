'use strict';

App.View.Indicator = Backbone.View.extend({
    
    _template : _.template( $('#indicator-indicator_template').html() ),
    
    initialize: function(options) {
        App.events.trigger("menu", 2);
        
        this.model = new App.Model.IndicatorModel();
        this.model.url = this.model.url + options.indicatorId

        this.listenTo(this.model,"change:id",this.render);

        this.model.fetch({"reset": true})

    },

    events: {
        'click .tabs-header li' : 'changeRepresentation'
    },


    changeRepresentation:function(e){
        this.$('.tabs-header li').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.$('#tab_tabla').addClass('hide');
        this.$('#tab_grafica').addClass('hide');
        this.$('#' + $(e.currentTarget).attr('section')).removeClass('hide');
        
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        var data = this.model.get('data');
        var columns = 0;
        var keyValue;

        if(data.length > 0){
            data = data[0];
            $.each(data, function(key, value){
                if(key.indexOf('#0#') < 0){
                    columns ++;
                }
                keyValue = key;
            });
        }
        
        this.$el.html(this._template({
            indicator: this.model.toJSON(),
            columns: columns
        }));

        Map.drawIndicators(this.model.get('data'), keyValue, this.model.get('nombre'));
        
        this._drawChart(keyValue);

        return this;
    },

    _drawChart:function(keyValue){
        var data = new google.visualization.DataTable();
        

        var options = {
         'width':$(".indicadores-body").outerWidth() - 43,
         'height':$(".indicadores-body").outerHeight(),
          bars: 'horizontal',
          // chartArea: { 
          //   width: "100%",
          //   left:'3'
          // },
          // bar: { groupWidth: "90%" },
          legend: { position: "none" },
       //    animation:{
          //   duration: 1000,
          //   easing: 'out',
          // },
          vAxis:{
            textStyle:{
                fontSize:12,
                color:'#5d5b5c',
            }
          },

          hAxis:{
            textStyle:{
                fontSize:14,
                color:'#5d5b5c'
            },
            viewWindow:{
                min:0
            }
          },
          colors:['#bd5755'],
          tooltip: {isHtml: true}

        };


        var data = new google.visualization.DataTable();
        data.addColumn('string', '');
        data.addColumn('number', '');

        $.each(this.model.get('data'), function(){
            var title = '';
            var number;
            $.each(this, function(key, value){
                if(key!='#0#y' && key!='#0#x' && key!=keyValue){
                   title += value + ' - '
                }else if(key==keyValue){
                    number = parseFloat(value);
                }
            });
            data.addRow([title.substring(0, title.length - 3), number]);
        });

        var formatter = new google.visualization.NumberFormat({pattern: '###,###.##'});
        formatter.format(data, 1);

        var chart = new google.visualization.BarChart(document.getElementById('tab_grafica'));
        chart.draw(data, options);
        this.$('#tab_grafica').addClass('hide');
    }
});