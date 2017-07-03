/**
 * Created by sy on 17/6/30.
 */
"use strict";

var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

var base = "/Users/sy/workspace/syeui/";
var root = path.join(base,process.argv[2] || '.');

console.log("Static root dir:"+root);

var server = http.createServer(function(req,res){
    var parserUrl = url.parse(req.url);
    var pathName = parserUrl.pathname;
    console.log("pathName:",pathName);
    var filePath = path.join(root,pathName);
    console.log("filePath:",filePath);
    fs.stat(filePath,function(err,stats){
       if(!err && stats.isFile()){
           console.log("200 "+req.url);
           res.writeHead(200);
           fs.createReadStream(filePath).pipe(res);
       }else{
           console.log("404 "+req.url);
           res.writeHead(404);
           res.end("404 Not Found");
       }
    });
});

server.listen(8080);