util = {
  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
};


LedStatusVisualizer = (function(){
  function LedStatusVisualizer(){
    this.digits = {
      "d4": { pin: LED1 } ,
      "d2": { pin: LED2 } ,
      "d1": { pin: LED3 }
    };
  }
  
  LedStatusVisualizer.prototype = {
    show: function( num ){
      
      var n = Number(num).toString( 2 );
      n = util.pad( n, 3, "0");
      console.log(n);
      this._showBinary(n);
    },
    
    _showBinary: function( bin ){
      this.digits.d4.pin.write( bin.charAt(0) == "1" );
      this.digits.d2.pin.write( bin.charAt(1) == "1" );
      this.digits.d1.pin.write( bin.charAt(2) == "1" );
    }
  };
  
  return LedStatusVisualizer;
})();





ToiletApp = {};
ToiletApp.def = {

  wifi: {
    id: "HWD14_904E2B402303",
    password: "8a6g1tijbi2t8ah"
  },

  /*
  wifi: {
    id: "BCW710J-83EEA-G",
    password: "d5433a48fe448"
  },
  */

  server: {
    //host: "192.168.100.100",
    //host: "192.168.0.10",
    host: "test-toilet.herokuapp.com",
    //port: "3000"
    port: "80"
  },

  device: {
    id: 'asl'
  },

  room: {
    id: 'asl-3f',
    stalls: [
      { id: 'asl1', pin: C4 } ,
      { id: 'asl2', pin: C5 }
    ]
  }
}

;
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
ToiletApp.SyncRequestProcessor = (function(){

  function SyncRequestProcessor( options ){
    options = options || {};
    this.requests = [];
    this.interval = 2000;
    this.timer = {};
    this.syncer = options.syncer || { sync: function( target ){ console.log( target ); } };
  }

  SyncRequestProcessor.prototype = {

    _httpActionTimer: function( _this ){
      nextAction = function(){_this._httpActionTimer(_this);};
      _this._httpAction();
      _this.timer = setTimeout( nextAction, _this.interval );
    },

    // there might be no support for array#shift on Espruino.
    _shiftRequest: function(){
      if( this.requests.length <= 0  ) return void(0);
      var rtn = this.requests[0];

      this.requests = this.requests.slice( 1, this.requests.length );
      return rtn;
    },

    _httpAction: function(){
      if( !wifi.isReady ){ console.log('not ready'); return; }

      var target = this._shiftRequest();
      if(!target) return; 

      this.syncer.sync( target );
    },
    start: function(){
      this._httpActionTimer( this );
    },
    stop: function(){
      this.requests = [];
      clearTimeout( this.timer );
    },
    push: function( val ){
      this.requests.push( val );
    }
  };
  
  return SyncRequestProcessor;

})();


ToiletApp.Syncer = (function(){
  function Syncer(){
    this.http = require("http");
  }
  
  Syncer.prototype = {
    sync: function( target ){
      var serverDef = ToiletApp.def.server;
      var payload = {
        _method: 'PUT',
        status: target.status
      };
      var urlpayload = "_method=" + payload._method +"&status=" + payload.status;
 
      var options = {
        host: serverDef.host,
        port: serverDef.port,
        path: '/stalls/' + target.id + '/sync_status',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': urlpayload.length
        },
        method: 'POST'
      };
      
      var http = this.http;
            
      var req = http.request( options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          target.door.markSyncedState();
        });
      });
      
      req.write( urlpayload );
      req.end();
    }
    
  };
  
  return Syncer;
  
})();
ToiletApp.DoorSensor = (function(){ 
  function DoorSensor( id, options ){
    var _options = options || {};
    this.id = id;
    this.pin = options.pin || A1;
  }
  DoorSensor.prototype = {
    isOpen: function(){
      return this.pin.read();
    }
  };
  return DoorSensor;
})();

/*
 * [stall] chiefly US :
 *   a small, enclosed area with room for one person in a bathroom 
 *   ▪ shower stalls ; especially : a small, enclosed area with a toilet 
 *   ▪ All the (bathroom) stalls were occupied.
 */

ToiletApp.Stall = ( function(){
  function Stall( options ){
    var statuses = ToiletApp.Stall.STATUSES;
    this.state = statuses.unknown;
    this.stateUpdatedAt = getTime();
    this.syncedState = "";
    this.beforeState = statuses.unknown;
    this.id = options.id;
    this.doorSensor = options.doorSensor;
    this.wifiConnectedTime = 0;
  }

  Stall.STATUSES = {
    unknown: "unknown",
    vacant: "vacant",
    maybe_occupied: "maybe_occupied",
    occupied: "occupied",
    maybe_vacant: "maybe_vacant"
  };

  Stall.prototype = {
  
    isUnknown: function(){ return this.state == Stall.STATUSES.unknown; },
    isMaybeVacant: function(){ return this.state == Stall.STATUSES.maybe_vacant; },
    isVacant: function(){ return this.state == Stall.STATUSES.vacant; },
    isMaybeOccupied: function(){ return this.state == Stall.STATUSES.maybe_occupied; },
    isOccupied: function(){ return this.state ==  Stall.STATUSES.occupied; },
    toUnknown: function(){
      console.log("to unknown");
      this.state = Stall.STATUSES.unknown;
    },

    putTimeStamp: function(){
      if(this.beforeState != this.state ){ this.stateUpdatedAt = getTime(); }
    },
  
    markSyncedState: function(){
      this.syncedState = this.state;
    }
    ,
    _getNextState: function(){
      var statuses = ToiletApp.Stall.STATUSES;
      var nextState;
      if( this.isUnknown() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isVacant() ){
        if( this.doorSensor.isOpen() ){
          nextState= statuses.vacant;
        }else{
          nextState = statuses.maybe_occupied;
        }
      }else if( this.isMaybeOccupied() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isOccupied() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.maybe_vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isMaybeVacant() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }
      return nextState;
    },
  
    toNextState: function(){
      this.beforeState = this.state;
      this.state = this._getNextState();
      this.putTimeStamp();
    },
  
    hasChangedToOccupiedState: function(){
      var statuses = Stall.STATUSES;
      var openToClose = this.beforeState == statuses.maybe_occupied && this.state == statuses.occupied;
      var unknownToClose = this.beforeState == statuses.unknown && this.state == statuses.occupied;
      return openToClose || unknownToClose;
    },
    hasChangedToVacantState: function(){
      var statuses = Stall.STATUSES;
      var closeToOpen = this.beforeState == statuses.maybe_vacant && this.state == statuses.vacant;
      var unknownToOpen = this.beforeState == statuses.unknown && this.state == statuses.vacant;
      return closeToOpen || unknownToOpen;
    }
  };
  return Stall;
})();


function stopMonitoring(){
  var serverDef = ToiletApp.def.server;
  var payload = {
    method: 'PUT'
  };
  var urlpayload = "_method=" + payload.method;

  var options = {
    host: serverDef.host,
    port: serverDef.port,
    path: '/devices/' + ToiletApp.def.device.id + '/stop_monitoring',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlpayload.length
    },
    method: 'POST'
  };


  var req = require("http").request( options, function(res) {
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.write( urlpayload );
  req.end();
};

ToiletApp.checkDoorTimer = function( door ){
  ToiletApp.checkDoor( door);
  setTimeout( function(){
    ToiletApp.checkDoorTimer( door );
  }, 1000 );
};

ToiletApp.checkDoor = function( door){

  if( door.wifiConnectedTime != wifi.connectedTime ){
    door.toUnknown();
    door.wifiConnectedTime = wifi.connectedTime;
  }

  door.toNextState();
  var requestTarget = {
    id: door.id,
    status: door.state,
    door: door
  };

  if( door.hasChangedToVacantState() ) R.push( requestTarget );
  if( door.hasChangedToOccupiedState() ) R.push( requestTarget );

};

var LEDs = new LedStatusVisualizer();
var statuses = {
  "initial": 0,
  "started": 1,
  "": 2,
  "": 3,
  "": 4,
  "": 5,
  "stopped": 6,
  "unexpected": 7,
};



function hoge(  stallDef ){
    console.log( "======================" );
    console.log( stallDef );
    console.log( stallDef.pin );
    var pin = stallDef.pin;
  
    var sensor = new ToiletApp.DoorSensor( "d1", { pin: pin });
    var stall = new ToiletApp.Stall( {id: stallDef.id, doorSensor: sensor });
    ToiletApp.checkDoorTimer( stall );
}

var wifiConnectedCallback = function(){

  var serverDef = ToiletApp.def.server;
  var stallsDef = ToiletApp.def.room.stalls;

  var stallsRequestString = "";
  for( var i = 0; i < stallsDef.length; i ++){ 
    stallsRequestString += ( "&stall_names[]=" + stallsDef[i].id );
  }

  var payload = {
    _method: 'PUT'
  };
  var urlpayload = "_method=" + payload._method + stallsRequestString;

  var options = {
    host: serverDef.host,
    port: serverDef.port,
    path: '/devices/' + ToiletApp.def.device.id + '/start_monitoring',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlpayload.length
    },
    method: 'POST'
  };

  var req = require("http").request( options, function(res) {
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.write( urlpayload );
  req.end();

};

var R = void(0);
var wifi = void(0);
var heartBeat = void(0);
function onInit(){

  clearInterval();
  clearTimeout();

  LEDs.show( statuses.started );
  var syncer = new ToiletApp.Syncer();
  heartBeat  = new ToiletApp.HeartBeat();
  wifi = new ToiletApp.Wifi( wifiConnectedCallback );
  R = new ToiletApp.SyncRequestProcessor( {syncer: syncer} );
  
  var stalls = ToiletApp.def.room.stalls;
  var stallsLength = stalls.length; 

  // TODO : method $B$K(B
  for( var i=0; i < stallsLength ; i++ ){
    var stallDef = stalls[i];
    hoge( stallDef );
  }

  LED1.write(false);
  setTimeout( function(){ heartBeat.start(); R.start(); LED1.write(true);}, 5000 );

  var stopped = false;

  function stopAll(){
    stopMonitoring();
    heartBeat.stop();
    R.stop();
    LEDs.show( statuses.stoped );
  }
  
  setInterval( function(){
    if( BTN1.read()  && !stopped ){ 
      stopped = true;
      stopAll();
    }
  } ,1000);

  setInterval( function(){
    if( !C9.read()  && wifi.isReady ){ 
      console.log("C9 PUSHED!!");
      wifi.reconnect();
    }
  } ,1000);
}

onInit();












//

;
