window.reload = function( interval ){
  var intervaltime = interval || 1000;
  setTimeout( function(){
    location.reload();
  }, 1000);
}

