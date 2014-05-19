
//= require ./stall_model
//= require ./admin_console_stall_template
AdminConsoleStoleView = Backbone.Marionette.ItemView.extend({

  initialize: function(){
    this.statusUpdatedAt = moment( new Date( this.model.get('status_updated_at')) );

    this.update();

    var _this = this;
    $.get( '/data/percent?stall_name=' + this.model.get("name") ).done(function(data){
      _this.$('.amount').html( data );
    });


  },

  template : 'sample_requests/admin_console_stall_template',
  templateHelpers:{
    hoge: function(){
      return {
        "vacant":"VACANT",
        "occupied":"OCCUPIED",
        "unknown":"UNKNOWN"
      }[this.status]
    }
  },

  update: function(){
    var _this = this;
    setInterval( function(){
      var s = moment().diff( _this.statusUpdatedAt, 'seconds');
      if( s >= 1200){
        _this.$('.last_monitored').html( "over " + _this.statusUpdatedAt.fromNow(true) );
      }else{
        _this.$('.last_monitored').html( moment().hour(0).minute(0).second( s ).format("mm:ss") + " elapsed" );
      }
    }, 1000);
               
  }

});

