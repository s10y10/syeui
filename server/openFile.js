/**
 * Created by sy on 17/6/29.
 */
"use strict";
var fs = require("fs");

function openFile(path,cf,cb){
    fs.readFile(path,"utf-8",function(err,data){
            if(err){
                console.log(err);
            }else{
                cf.call(cb,data);
            }
        })
}
module.exports = {
    open:openFile
};