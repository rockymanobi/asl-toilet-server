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

  // TODO : method に
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

