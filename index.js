var express = require('express');
var add = require('./lib/add');
var app = express();

var port = process.env.PORT || 8080;

app.get('/test', function (req, res) {
    var data = {
        "msg": "hello world! 2332", 
        "result": add(Number(req.query.input))
    }
    console.log( data );
    res.end( JSON.stringify(data) );
})

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("應用實例，訪問地址為 http://%s:%s", host, port)

})