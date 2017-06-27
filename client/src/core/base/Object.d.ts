/**
 * Created by brucex on 9/2/14.
 */

interface Object{
    getValue(name:string, defaultValue?:any):any;
    exists(name:string):boolean;
    setValue(name:string, value:any, adding?:boolean):void;
    getExistsKey(name:string):string;
    isEmpty():boolean;
    clone():any;
}

interface Array<T> {
    find(predicate, thisArg?):any;
    remove(fun, thisArg?):void;
    findIndex(predicate, thisArg?):number;
    removeValues(...args):void;
    shuffle():Array<T>;
}

interface String {
    exists(name:string):boolean;
    nickName(len:number):string;
    tr(...args):string;
    toPercentage():number;
    parseFormat(...args):string;
    trim():string;
}
//
//declare module egret {
//    class DisplayObjectContainer {
//        removeAllChildren():void;
//    }
//
//    class DisplayObject {
//        removeFromParent():void;
//        isVisible():boolean;
//    }
//}

