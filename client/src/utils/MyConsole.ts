/**
 * Created by sy on 17/3/31.
 */
class MyConsole{
    public static init(){
        var d = new Date(), log = console.log,c = d.getTime();
        console.log = function() {
            for (var i = [], n = 0; n < arguments.length; n++)
                i[n - 0] = arguments[n];
            var et = egret.getTimer();
            d.setTime(c + et);
            var a = d.getHours(), o = d.getMinutes(), l = d.getSeconds(), r = (10 > a ? "0" + a : a) + ":" + (10 > o ? "0" + o : o) + ":" + (10 > l ? "0" + l : l);
            i.unshift(r), log.apply(console, [i]);//.join(" ")
        }
    }
    public static getTimeStr(){
        //var et = egret.getTimer();
        //d.setTime(c + et);
        //var a = d.getHours(), o = d.getMinutes(), l = d.getSeconds(), r = "[" + (10 > a ? "0" + a : a) + ":" + (10 > o ? "0" + o : o) + ":" + (10 > l ? "0" + l : l) + "]";
        //return r;
    }
}