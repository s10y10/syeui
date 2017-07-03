/**
 * Created by sy on 17/6/29.
 */
'use strict';

var h = "Hello";
var b = "bye";

function hello(name){
    console.log(h+","+name+"!");
}

function bye(name){
    console.log(b+","+name+"!");
}

module.exports = {
    h:hello,
    b:bye
}
