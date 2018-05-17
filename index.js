var express = require('express');
var add = require('./lib/add');
var app = express();

app.get('/', function (req, res) {
    var data = {
        "msg": "hello world! 2130", 
        "result": add(Number(req.query.input))
    }
    console.log( data );
    res.end( JSON.stringify(data) );
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("應用實例，訪問地址為 http://%s:%s", host, port)

})