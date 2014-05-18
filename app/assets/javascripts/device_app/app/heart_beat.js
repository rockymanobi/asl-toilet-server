ToiletApp = ToiletApp || {};
ToiletApp.HeartBeat = (function(){
  function HeartBeat(){
    this.timer = void(0);
    this.successCounter = 0;
    this.requestCounter = 0;
    this.interval = 45000;
  }

  HeartBeat.prototype = {
    start: function(){
      this.heartBeatTimer();
    },
    stop: function(){
      console.log("heartbeat stopped");
      clearTimeout( this.timer );
    },
    heartBeatTimer: function(){
      var _this = this;
      this.heartBeat();
      this.timer = setTimeout( function(){
        _this.heartBeatTimer();
      }, this.interval);
    },

    heartBeat: function(){

      var _this = this;



      if( this.requestCounter - this.successCounter >= 2 ){
        this.requestCounter = 0;
        this.successCounter = 0;
        wifi.reconnect();
        return;
      }

      this.requestCounter += 1;
      if( !wifi.isReady ){ console.log('wifi not ready for heart beat');return; }

      var serverDef = ToiletApp.def.server;
      var payload = {
        method: 'PUT',
        status: 'running'
      };
      var urlpayload = "_method=" + payload.method +"&status=" + payload.status;

      var options = {
        host: serverDef.host,
        port: serverDef.port,
        path: '/devices/' + ToiletApp.def.device.id + '/heart_beat',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': urlpayload.length
        },
        method: 'POST'
      };

      var req = require("http").request( options, function(res) {
        res.on('data', function (chunk) {
          _this.successCounter += 1;
          console.log('BODY: ' + chunk);
        });
      });

      req.write( urlpayload );
      req.end();

    }
  };

  return HeartBeat;

})(); 



