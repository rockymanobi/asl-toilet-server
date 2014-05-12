ToiletApp.Syncer = (function(){
  function Syncer(){
    this.http = require("http");
  }
  
  Syncer.prototype = {
    sync: function( target ){
      var serverDef = ToiletApp.def.server;
      var payload = {
        _method: 'PUT',
        status: target.state
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
        });
      });
      
      req.write( urlpayload );
      req.end();
    }
    
  };
  
  return Syncer;
  
})();
