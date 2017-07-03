"use strict";

var http = require("http");
var url = require("url");

var server = http.createServer(function(req,res){
    res.writeHead(200,{"Content-Type":"text/html"});
    res.writeHead(200,{"Access-Control-Allow-Origin":"*"});

    var requrl = url.parse(req.url);

    console.log(requrl.query);

    //var user = {
    //    "h":"NjEyODg0NzI3Mzk4OCwxNDk4NzMwMjI4NTkwLHF3ZXJ0YXNkZmc=",
    //    "t":new Date().getTime()
    //};
    //var result = {
    //    "s":0,
    //    "r":user
    //};
    //res.end(JSON.stringify(result));
    res.end('<h1>Hello world!</h1>');
});

server.listen(8080);