ToiletApp.Wifi = (function(){
  function Wifi( callback ){
    var def = ToiletApp.def;
    this.wlan = require("CC3000").connect();
    this.isReady = false;
    this.connectedTime = 0;
    var _this = this;
    var h = this.wlan.connect( def.wifi.id, def.wifi.password, function (s) { 
      if (s=="dhcp") {
        _this.connectedTime = getTime();
        console.log('wifi connected!');
        _this.isReady = true;
        callback();
      }
    });
  }

  Wifi.prototype = {
    reconnect: function(){
      this.isReady = false;
      this.wlan.reconnect();
    }
  };

  return Wifi;

})();
