window.listen_heart_beat_request = function(){
  $.post('/sample_requests/listen_heart_beat')
    .done( function(){ console.log("ok"); })
    .fail( function(){ console.log("ng"); });
}
