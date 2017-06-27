/**
 * Created by brucex on 9/2/14.
 */

function implement(type:any, ...args):void {
    var prototype = type.prototype;
    for (var i:number = 0; i < args.length; i ++) {
        var prop:any = args[i];
        for (var key in prop) {
            Object.defineProperty(prototype, key, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: prop[key]
            });
        }
    }
};

implement(Object, {
    getValue: function(name:string, defaultValue:any = null):any {
        if (name == null) {
            return defaultValue
        }
        var propertys:Array<string> = name.toString().split(/\s+/gi);
        for (var i:number = 0; i < propertys.length; i++) {
            var propertyName:string = propertys[i];
            if (this.hasOwnProperty(propertyName)) {
                return this[propertyName];
            }
        }
        return defaultValue;
    },
    setValue: function(name:string, value:any, adding:boolean = false):void {
        if (name == null) {
            return;
        }
        var propertyName:string = this.getExistsKey(name);
        if (value == null) {
            delete this[propertyName];
        }
        else if (adding && this.hasOwnProperty(propertyName)) {
            this[propertyName] += value;
        } else {
            this[propertyName] = value;
        }
    },
    getExistsKey: function(name:any):string {
        if (name) {
            name = name + "";
            var propertys:string[] = name.split(/\s+/gi);
            for (var i:number = 0; i < propertys.length; i ++) {
                if (this.hasOwnProperty(propertys[i])) {
                    return propertys[i];
                }
            }
            return propertys[0];
        }
    },
    exists: function(name:string):boolean {
        if (name) {
            name = name + "";
            var propertys:Array<string> = name.split(/\s+/gi);
            for (var i:number = 0; i < propertys.length; i++) {
                if (this.hasOwnProperty(propertys[i])) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    isEmpty: function():boolean {
        return Object.keys(this).length == 0;
    },
    existsProperty: function(property) {
        if (property) {
            property = property + "";
            var arr = property.split(/\s+/gi);
            for (var i = 0; i < arr.length; i ++) {
                if (this.hasOwnProperty(arr[i])) {
                    return true;
                }
            }
            return false;
        }
    },
    clone: function(){
        var objClone;
        if (this.constructor == Object){
            objClone = new this.constructor();
        }else{
            objClone = new this.constructor(this.valueOf());
        }
        for(var key in this){
            if ( objClone[key] != this[key] ){
                if ( typeof(this[key]) == 'object' ){
                    objClone[key] = this[key].clone();
                }else{
                    objClone[key] = this[key];
                }
            }
        }
        return objClone;
    }
});

implement(Array, {
    /**
     * 返回回调函数为true的第一个数组元素
     * @param predicate
     * @param thisArg
     * @returns {*}
     */
    find: function(predicate, thisArg = 0) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = this;
        var length = list.length >>> 0;
        var value;

        for (var i = 0; i < length; i++) {
            if (i in list) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
        }
        return null;
    },
    shuffle: function() {
        this.sort(function(a,b):number {
            return Math.random() > 0.5 ? -1 : 1;
        });
        return this;
    },
    /**
     * 删除回调函数为true的所有数组元素
     * @param fun
     * @param thisArg
     */
    remove: function(fun, thisArg = 0) {
        'use strict';

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = this;
        var len = t.length >>> 0;
        if (typeof fun !== 'function')
            throw new TypeError();

        for (var i = len - 1; i >= 0; i--)
        {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                t.splice(i, 1);
            }
        }
    },
    findIndex: function(predicate, thisArg) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = this;
        var length = list.length >>> 0;
        var value;

        for (var i = 0; i < length; i++) {
            if (i in list) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return i;
                }
            }
        }
        return -1;
    },
    /**
     * 删除指定参数的数组元素(可删除重复元素)
     * @param args
     */
    removeValues: function(...args):void {
        'use strict';

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = this;
        var len = t.length >>> 0;

        for (var i = len - 1; i >= 0; i --) {
            if (i in t) {
                for (var j = 0; j < args.length; j ++) {
                    if (j in args && t[i] == args[j]) {
                        t.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
});

function __getSubstrLen(name:string):number {
    var ret:number = 0;
    for (var i = 0; i < name.length; i ++) {
        var byte:number = 0;
        if ((/[\x00-\xff]/g).test(name.charAt(i))) {
            byte = 1;
        } else {
            byte = 2;
        }
        ret += byte;
    }
    return ret;
}
var ___global = this;
implement(String, {
    exists: function(name:string):boolean {
        var propretys:string[] = this.split(/\s+/gi);
        return propretys.indexOf(name) > -1;
    },
    toPercentage: function():number {
        if (this.indexOf("%") > -1) {
            return parseInt(this.replace("%", ""));
        }
        if (this.indexOf(".") > -1) {
            return parseFloat(this) * 100;
        }
        return parseInt(this);
    },
    parseFormat: function(...args):string {
        var ret:string = this.replace(/\$\{?(([0-9]+)(\:([^\}]+))?)\}?/gi, function(a:string, a2:string, idx:number, a3:string, t:string):any {
            if (t == "x") {
                return args[idx].toString(16).toLowerCase();
            } else if (t == "X") {
                return args[idx].toString(16).toUpperCase();
            }
            return args[idx];
        });
        return ret;
    },
    tr: function(...args):string {
        var s = __global.translateGameString(this);
        var pro:any = String.prototype;
        var s = pro.parseFormat.apply(s, args);
        return s;
    },
    nickName: function(len:number):string {
        if (len < 1) {
            return this;
        }
        var ret:string[] = [];
        var count:number = 0;
        for (var i = 0; i < this.length; i ++) {
            var byte:number = 0;
            if ((/[\x00-\xff]/g).test(this.charAt(i))) {
                byte = 1;
            } else {
                byte = 2;
            }
            if (count + byte <= len - 2) {
                ret.push(this.charAt(i));
            } else {
                var subLen:number = __getSubstrLen(this.substr(i));
                if (subLen <= 2) {
                    ret.push(this.charAt(i));
                } else {
                    ret.push("..");
                    break;
                }
            }
            count += byte;
        }
        return ret.join("");
    },
    trim: function():string {
        var s:string = this.replace(/(^\s*)|(\s*$)/gi, "");
        return s;
    }
});