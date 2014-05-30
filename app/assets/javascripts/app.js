
//=require bempty/stall_template
//=require bempty/tell_me_template
//=require bempty/device_template
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
    App.data.bootstrapedDevice = options.data.bootstrapedDevice
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

        var expand = _.bind( function(){  this.$('.TELL-ME').addClass("EXPAND")} ,this);
        var toNormalSize = _.bind( function(){  this.$('.TELL-ME').removeClass("EXPAND")} ,this);
        var blink = function(){
          expand();
          setTimeout( toNormalSize , 100 );
          setTimeout( blink , 1000 );
        }
        blink();


      },
      templateHelpers: {
      },
      onModelSync: function(){
        this.render();
      },

      notify:  function(){ 
        var _this = this;

        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
          return false;
        } else if (window.Notification.permission !== 'denied') {

          if( window.Notification.permission !== 'granted'  ){ alert("ブラウザからの通知を許可しよう！\n許可しないと教えてくれないよ！"); }

          window.Notification.requestPermission(function (permission) {

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
        notif({
          type: "info",
          msg: "空いたら教えるよ！！ でも、ページをリロードしたら教えて上げないよ",
          width: "all",
          position: "center",
          autohide: false
        });
        var _this = this;
        var ask = function(){
          $.when( _this.asl1Model.fetch(), _this.asl2Model.fetch() )
          .then( function(){
            if( _this.asl1Model.isVacant() || _this.asl2Model.isVacant() ){
              _this.waiting = false;
              notifyMe();
              _this.timerStop();
              notif({
                type: "success",
                msg: moment().format("h時 m分") + "&nbsp;に空いたよ！！もう閉まったかもしれないけど...",
                width: "all",
                position: "center",
                autohide: false
              });
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

    var DeviceView = Marionette.ItemView.extend({
      template: "bempty/device_template",
      templateHelpers: {
        statusText: function(){
          var text = {
            "sleep" : "今は監視をしていません。",
            "error" : "監視デバイスからの応答が途絶えました...復旧までお待ちください",
            "running" : "絶賛監視中でございます！"
          }[ this.status ] 
          return text;
        },
      },
      initialize: function(){
        this.listenTo( this.model, "sync", this.render );
      },
    });
    var TestView = Marionette.ItemView.extend({
      template: "bempty/stall_template",
      initialize: function(){
        this.listenTo( this.model, 'sync', this.onSync  );
        this.listenTo( this.model, 'request', this.onRequest  );
      },
      events: {
        "click .door-toggle": "onDoorToggleClick"
      },
      onDoorToggleClick: function(){
        this.$('.HALF').removeClass("HALF");
        this.$('.OUTSIDE').toggleClass("OPEN");
      },
      onRequest: function(){
        this.$el.addClass("REQUESTING");
      },
      onSync: function(){
        this.$el.removeClass("REQUESTING");
        this.$('.OUTSIDE').removeClass("OPEN");
        this.$('.OUTSIDE.VACANT').addClass("HALF");
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
        tellMeRegion: "#tell-me",
        deviceRegion: "#device"
      },
      initialize: function(options){
        this.models = [  options.stall1, options.stall2, options.device ];
      }
      ,
      onRefreshClick: function(){
        App.clearNotice();
        _.each( this.models, function( val ){
          val.fetch();
        });

      }
    });


    var Device = Backbone.Model.extend({
      urlRoot: '/devices',
      idAttribute: 'name',
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
      var device = new Device( App.data.bootstrapedDevice );
      var testLayout = new TestLayout( { stall1: stall1, stall2: stall2, device: device } );
      App.main.show( testLayout );
      testLayout.asl1Region.show( new TestView( { model: stall1} ) );
      testLayout.asl2Region.show( new TestView( { model: stall2} ) );
      testLayout.tellMeRegion.show( new TellMeView( { asl1Model: stall1, asl2Model: stall2 } ) );
      testLayout.deviceRegion.show( new DeviceView( { model: device} ) );

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
    
    var options = {
      body: "はやくしないと閉まってしまうかも",
      icon: AssetsPaths["notify_icon.png"]
    } 
    var notification = new Notification("空いたよ!!空いたよ!!", options);
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
    window.ee = e;
    var $t = $( e.currentTarget );
    $t.addClass("on");
    setTimeout( function(){ $t.removeClass("on") } ,200);
  });
});
