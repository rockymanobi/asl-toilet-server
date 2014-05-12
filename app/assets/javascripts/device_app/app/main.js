

function heartBeatTimer(){
  setInterval( heartBeat, 5000 );
}

function heartBeat(){
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

  var http = this.http;

  var req = http.request( options, function(res) {
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

  door.toNextState();

  if( door.hasChangedToVacantState() ) R.push( door );
  if( door.hasChangedToOccupiedState() ) R.push( door );
  console.log( door.id +  ":" + door.state );

};

var LEDs = new LedStatusVisualizer();
var statuses = {
  "initial": 0,
  "started": 1,
  "": 2,
  "": 3,
  "": 4,
  "": 5,
  "": 6,
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

var R = void(0);
var wifi = void(0);
function onInit(){
  LEDs.show( statuses.started );
  var syncer = new ToiletApp.Syncer();
  wifi = new ToiletApp.Wifi();
  R = new ToiletApp.SyncRequestProcessor( {syncer: syncer} );
  
  var stalls = ToiletApp.def.room.stalls;
  var stallsLength = stalls.length; 

  // TODO : method に
  for( var i=0; i < stallsLength ; i++ ){
    var stallDef = stalls[i];
    hoge( stallDef );
  }



  LED1.write(false);
  setTimeout( function(){ heartBeatTimer(); R.start(); LED1.write(true);}, 5000 );
}

onInit();

