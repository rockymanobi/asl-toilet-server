
ToiletApp = ToiletApp || {};
var requests = [];

ToiletApp.checkDoor = function( door, interactor ){
  // display 
  interactor.showProgress();

  door.toNextState();

  if( door.hasChangedToVacantState() ) requests.push( door.id + "-VACANT!!");
  if( door.hasChangedToOccupiedState() ) requests.push( door.id + "-OCCUPIED!!");

  interactor.showState(door);

}

ToiletApp.checkDoorTimer = function( door, interactor ){
  ToiletApp.checkDoor( door, interactor );
  setTimeout( function(){
    ToiletApp.checkDoorTimer( door, interactor );
  }, 1000 );
}


//////////////////////////////////
//////////////////////////////////
httpActionTimer = function(){
  httpAction();
  setTimeout( httpActionTimer, 2000 );
}

httpAction = function( ){
  var target = requests.shift();
  var element = document.getElementById("action"); 
  var text = "";
  if( target ){
    text = target + " ||| ";
    element.innerText = element.innerText + text;
  }
}
///////////////////////////////////////////
// main logic
///////////////////////////////////////////
function main(){

  var d1Sensor = new ToiletApp.Fake.DoorSensor( "d1" );
  var stall1 = new ToiletApp.Stall( {id: "d1", doorSensor: d1Sensor });
  var d1Interactor = new ToiletApp.Fake.Interactor( "d1" );

  var d2Sensor = new ToiletApp.Fake.DoorSensor( "d2" );
  var stall2 = new ToiletApp.Stall( {id: "d2", doorSensor: d2Sensor });
  var d2Interactor = new ToiletApp.Fake.Interactor( "d2" );

  ToiletApp.checkDoorTimer( stall1, d1Interactor );
  ToiletApp.checkDoorTimer( stall2, d2Interactor );
  httpActionTimer();

}

main();



