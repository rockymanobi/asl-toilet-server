
//=require bempty/stall_template
//=require bempty/tell_me_template
//=require bempty/main_layout
BEmpty = (function(Backbone, Marionette){

  "use strict";

  var App = new Marionette.Application();
  App.hoge = "text";

  App.addRegions({
    main: "#CUSTOMER-MAIN"
  });

  App.on("initialize:after", function(){
    if (Backbone.history){
      Backbone.history.start();
    }
  });
  
  App.addInitializer( function(options){
    App.data = App.data || {};
    App.data.bootstrapedAsl1 = options.data.bootstrapedAsl1
    App.data.bootstrapedAsl2 = options.data.bootstrapedAsl2
  });

  App.startSubApp = function(appName, args){
    var currentApp = App.module(appName);
    if (App.currentApp === currentApp){ return; }

    if (App.currentApp){
      App.currentApp.stop();
    }

    App.currentApp = currentApp;
    currentApp.start(args);
  };

  App.showNotice = function( text, colorClass ){
    $('#NOTICE p').remove();
    $('#NOTICE').append( "<p class=" + colorClass +  ">" + text + "</p>");
  }
  App.clearNotice = function( ){
    $('#NOTICE p').remove();
  }

  return App;
})(Backbone, Marionette);



BEmpty.module("SubApp", {

  define: function(SubApp, App, Backbone, Marionette){
    var MyRouter = Marionette.AppRouter.extend({
      controller: { someMethod: function(){ console.log("hoge"); }},
      appRoutes: {
        "foo": "someMethod"
      }
    });

    App.addInitializer(function(){
      var router = new MyRouter();
    });

    var TellMeView = Marionette.ItemView.extend({
      template: "bempty/tell_me_template",
      events: {
        "click .tell-me-btn" : "kickNotify",
      },
      initialize: function( options ){
        this.waiting = false;
        this.asl1Model = options.asl1Model;
        this.asl2Model = options.asl2Model;

        this.listenTo( this.asl1Model, "sync", this.onModelSync );
        this.listenTo( this.asl2Model, "sync", this.onModelSync );
        this.listenTo( App.vent, "timerStartKicked", this.notify );

        this.stallModels = [ this.asl1Model, this.asl2Model ];
        var _this = this;
        var helpers = {
          isNotWaiting: function(){
            return !_this.waiting;
          },
          bothOccupied: function(){
            var isBothOccupied = true;
            _.each( _this.stallModels, function( model, key ){ 
              if( !model.isOccupied() ){ isBothOccupied = false; }
            });
            return isBothOccupied;
          }
        }
        _.extend(this.templateHelpers, helpers);
      },
      templateHelpers: {
      },
      onModelSync: function(){
        this.render();
      },

      notify:  function(){ 
        console.log("noifyKicked");
        var _this = this;

        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
          return false;
        } else if (window.Notification.permission !== 'denied') {

          if( window.Notification.permission !== 'granted'  ){ alert("ブラウザからの通知を許可しよう！\n許可しないと教えてくれないよ！"); }

          window.Notification.requestPermission(function (permission) {

            console.log(123);
            // Whatever the user answers, we make sure we store the information
            if(!('permission' in window.Notification)) {
              window.Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
              _this.timerStart();
            }else{
              alert("通知許可してくれないと通知されないよ！\n拒否しちゃった人は通知設定を初期化しましょう。");
            }
          });
        }else{
          alert("通知許可してくれないと通知されないよ！\n拒否しちゃった人は通知設定を初期化しましょう。");
        }
      }
      ,
      kickNotify: function(){
        this.waiting = true;
        $('.tell-me-btn').addClass("hide");
        App.vent.trigger("timerStartKicked");
      },
      timerStart: function(){
        App.showNotice("空いたら教えるよ！！ でも、ページをリロードしたら教えて上げないよ", "green");
        console.log("timerStart");
        var _this = this;
        var ask = function(){
          $.when( _this.asl1Model.fetch(), _this.asl2Model.fetch() )
          .then( function(){
            console.log("asking");
            if( _this.asl1Model.isVacant() || _this.asl2Model.isVacant() ){
              _this.waiting = false;
              notifyMe();
              _this.timerStop();
              App.showNotice( moment().format("h時 m分") + "&nbsp;に空いたよ！！もう閉まったかもしれないけど...", "blue");
            }else{
              _this.waiting = true;
              _this.timer = setTimeout( ask , 5000)
            }
          })
        }

        this.timer = setTimeout( ask , 5000)
      },
      timerStop: function(){
        clearTimeout( this.timer );
        this.waiting = false;
      }
    });

    var TestView = Marionette.ItemView.extend({
      template: "bempty/stall_template",
      initialize: function(){
        this.listenTo( this.model, 'sync', this.onSync  );
      },
      events: {
        "click .door-toggle": "onDoorToggleClick"
      },
      onDoorToggleClick: function(){
        this.$('.HALF').removeClass("HALF");
        this.$('.OUTSIDE').toggleClass("OPEN");
      },
      onSync: function(){
        this.$('.OUTSIDE').removeClass("OPEN");
        $door = this.$('.DOOR');
        $door.removeClass("occupied");
        $door.removeClass("vacant");
        $door.removeClass("unknown");
        $door.addClass( this.model.get("status") );

      }
    });

    var TestLayout = Marionette.Layout.extend({
      template: "bempty/main_layout",
      events:{
        "click .refresh": "onRefreshClick"
      },
      regions: {
        asl1Region: "#asl1",
        asl2Region: "#asl2",
        tellMeRegion: "#tell-me"
      },
      initialize: function(options){
        this.models = [  options.stall1, options.stall2 ];
      }
      ,
      onRefreshClick: function(){
        App.clearNotice();
        _.each( this.models, function( val ){
          val.fetch();
        });

      }
    });


    var Stall = Backbone.Model.extend({
      urlRoot: '/stalls',
      idAttribute: 'name',
      isOccupied: function(){
        return this.get("status") === "occupied";
      },
      isVacant: function(){
        return this.get("status") === "vacant";
      }

    });

    SubApp.addInitializer(function(options){

      var stall1 = new Stall( App.data.bootstrapedAsl1 );
      var stall2 = new Stall( App.data.bootstrapedAsl2 );
      var testLayout = new TestLayout( { stall1: stall1, stall2: stall2 } );
      App.main.show( testLayout );
      testLayout.asl1Region.show( new TestView( { model: stall1} ) );
      testLayout.asl2Region.show( new TestView( { model: stall2} ) );
      testLayout.tellMeRegion.show( new TellMeView( { asl1Model: stall1, asl2Model: stall2 } ) );

    });

  }
});


BEmpty.module("SubApp", {
});

BEmpty.module("SubApp.TextView", {
  define: function(TextView, App){
  }
});


function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("空いたよ!!空いたよ!!　でももう閉まっちゃったかも...");
  }

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

}


$(document).ready(function(){
  $(document).on('click','.click-interactive', function(e){
    console.log(e);
    window.ee = e;
    var $t = $( e.currentTarget );
    $t.addClass("on");
    setTimeout( function(){ $t.removeClass("on") } ,200);
  });
});
