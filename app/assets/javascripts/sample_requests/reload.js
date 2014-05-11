window.reload = function( interval ){
  return;
  var intervaltime = interval || 1000;
  setTimeout( function(){
    location.reload();
  }, 1000);
}

