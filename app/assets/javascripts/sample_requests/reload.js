window.reload = function( interval ){
  var intervaltime = interval || 1000;
  setInterval( function(){
    location.reload();
  }, 1000);
}

