'use strict';

var ENTER_KEY = 13;

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();

  if (this.onClose){
    this.onClose();
  }
}

String.prototype.endsWith = function(suffix) {
   return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

App.events = {};

_.extend(App.events , Backbone.Events);

App.events.on("menu", function(id){
    // if(Map.getMap()){
    //     if(id==1){
    //         Map.getMap().removeLayer(Map.featureIndicators);
    //         Map.featureApplies.addTo(Map.getMap());
    //     }else if(id==2){
    //         Map.getMap().removeLayer(Map.featureApplies);
    //         Map.featureIndicators.addTo(Map.getMap());
    //     }
    // }

    if(id==3){
        // $("#map").hide();
    }else{
        // $("#map").show();
    }

    // $('.menu li').removeClass('active');
    // $('.menu li[menu="' + id + '"]').addClass('active');
    $('li[menu]').removeClass('active');
    $('li[menu="' + id + '"]').addClass('active');
});


$(function() {
    $(document).ajaxError(function(event, jqxhr) {
        if (jqxhr.status == 404) {
            App.router.navigate('notfound',{trigger: true});
        }
        else {
            App.router.navigate('error',{trigger: true});
        }
    });

    $('body').on('click','a',function(e){
        var attr = $(this).attr('jslink'),
            href = $(this).attr('href'),
            programUrl = '';

        if (attr!= undefined && attr!='undefined'){
            e.preventDefault();
            if (href=='#back') {
                history.back();
            }

            // if($(this).attr("program") != undefined && $(this).attr("program") !='undefined'){
            //     programUrl = 'program/' + App.programView.current + '/';
            // }

            App.router.navigate(programUrl + $(this).attr('href'),{trigger: true});
        }
    });


    App.ini();


    $(document).resize(function(){
        App.resizeMe();
    });

});

App.resizeMe = function(){

};

App.detectCurrentLanguage = function(){
    // Detect lang analyzing the URL
    if (document.URL.indexOf('/es/') != -1 || document.URL.endsWith('/es')) {
        return 'es';
    }
    else if (document.URL.indexOf('/en/') != -1 || document.URL.endsWith('/en')) {
        return 'en';
    }

    return 'es';
};

App.ini = function(){

    this.lang = this.detectCurrentLanguage();

    this.router = new App.Router({ });

    this.$main = $('main');

    this.$programs = $('#plan_header');

    // Backbone.history.start({pushState: true});

    // this.resizeMe();

    this.setAjaxSetup();

    App.isLogin();

};

App.isLogin = function(){

    var user = localStorage.getItem("user");

    if (user) {
        this.user = JSON.parse(user);
        // check user is really logged in
        App.doLogin(this.user)

    }else{

        Backbone.history.start({pushState: true});

        if(window.location.pathname != '/login' && window.location.hash != '#login'){
            // Backbone.history.start({pushState: true, silent: true});
            App.router.navigate('login',{trigger: true});
            App.resizeMe();
        }
    }
};

App.doLogin = function(user){
    this.user = user;
    $.ajax({
        url: App.config.API_URL + "/is_logged",
        dataType:"JSON",
        success: function(usercomplete) {
            App.user = usercomplete;
            App.user["password"] = user["password"];
            localStorage.setItem("user",JSON.stringify(App.user));

            if(App.user.profile == "Administrador"){
                $(".main-nav li[menu=3]").removeClass('hide');
                $('.main-nav li[menu=1] a[href="new_apply"]').removeClass('hide');
            }else{
                $(".main-nav li[menu=3]").addClass('hide');
                $('.main-nav li[menu=1] a[href="new_apply"]').addClass('hide');
            }


            if(window.location.pathname == '/login' || window.location.hash == '#login'){
                if(!Backbone.History.started){
                    Backbone.history.start({pushState: true, silent: true});
                }
                App.router.navigate('',{trigger: true});
            }else{
                if(!Backbone.History.started){
                    Backbone.history.start({pushState: true});
                }
            }

            App.loginComplete();
        },
        error: function (jqxhr, settings, exception) {
            localStorage.removeItem("user");
            if (jqxhr.status == 401) {
                // error();
                alert("Usuario incorrecto")
            }
        }
    });
}

App.loginComplete = function(){
    App.resizeMe();
    $('.masthead').removeClass('hide');
    $('.login-txt').text(App.user.name + ' ' + App.user.surname);
    // this.mapView = new App.View.Map({'idProgram': App.programView.current});

    // this.programView.setMap(this.mapView);
};

App.logout = function(){
    localStorage.clear();
    App.user = null;
    window.location.href = "/login";
};

App.setAjaxSetup = function(){
    $.ajaxSetup({
        // headers: App.getAuthHeaders,
        beforeSend: function (xhr) {
            var headers = App.getAuthHeaders();
            for (var h in headers) {
                xhr.setRequestHeader(h, headers[h]);
            }
        }
    });
};

App.getAuthHeaders = function(){
    if (this.user) {
        var timestamp = new Date().getTime();

        return {
            "auth-username": this.user.username,
            "auth-timestamp": timestamp,
            "auth-hash": md5(this.user.username + this.user.password + timestamp)
        }
    }
    else {
        return {}
    }
};


App.showView = function(view) {

    if (this.currentView){
      this.currentView.close();
    }

    this.currentView = view;

    this.$main.html(this.currentView.el);
    this.scrollTop();
}

// App.setProgram = function(id) {
//
//     //Incializo el programa
//     if(!this.programView){
//         this.programView = new App.View.Program({current:id});
//         this.$programs.html(this.programView.el);
//
//     }else{
//         this.programView.setCurrent(id);
//     }
//
//     //Inicializo el mapa
//     // if(!this.mapView && id){
//     //     this.mapView = new App.View.Map({'idProgram': this.programView.current});
//     //     this.programView.setMap(this.mapView);
//     // }
// }


App.scrollTop = function(){
    var body = $('html, body');
    body.animate({scrollTop:0}, '500', 'swing', function() {

    });
}

App.scrollToEl = function($el){
    $('html, body').animate({
        scrollTop: $el.offset().top
    }, 500);
}

App.nl2br = function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

App.slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

App.getBrowserInfo = function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

App.checkInputByName = function(_this, name){
    var $el = _this.$('input[name="' + name + '"]');
    if($el.length == 0){
      $el = _this.$('textarea[name="' + name + '"]');
    }
    if($el.length > 0 && $el.val() == ""){
      $el.addClass('error');
      return true;
    }

    return false;
},


App.formatNumber = function (n,decimals){

    if (n===null){
        return "--";
    }

    if (decimals ===null || decimals === undefined){
        decimals = 2;
    }

    if (typeof n == "number"){
        return parseFloat(sprintf("%."+ decimals + "f",n)).toLocaleString(this.lang, {
            style: 'decimal',
            minimumFractionDigits: decimals
        });
    }
    else{

        if (n.indexOf(".") != -1){
            n = sprintf("%."+ decimals + "f",n);
            return parseFloat(n).toFixed(decimals).toLocaleString(this.lang, {
                style: 'decimal',
                minimumFractionDigits: decimals
            });
        }
        else{
            return parseInt(n).toLocaleString(this.lang, {
                style: 'decimal',
                minimumFractionDigits: decimals
            });
        }
    }
};
