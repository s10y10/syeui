/**
 * Created by brucex on 9/1/14.
 */
class MultiProxy extends Proxy {
    private _subProxys:Array<Proxy> = [];
    public constructor(...argmts) {
        super(null);

        var args:Array<any> = [];
        if (argmts.length == 1 && Array.isArray(argmts[0])) {
            args = argmts[0];
        } else if (argmts.length > 0) {
            for (var i:number = 0; i < argmts.length; i ++) {
                args.push(argmts[i]);
            }
        }

        if (args) {
            for (var i:number = 0; i < args.length; i ++) {
                this.addSubProxy(args[i]);
            }
        }

        this.addParam("m", 1);
        addAction(ProxyAction.MULTIPROXY_ERROR,GameUtils.showErrorMess,GameUtils);
    }

    public load():void {
        if (this._subProxys.length == 0) {
            return;
        }
        super.load();
    }

    public getParamString():string {
        var arr:Array<any> = [];
        this._subProxys.forEach(function(proxy:Proxy) {
            var ret:any = {};
            for (var key in proxy.params) {
                if (Proxy.frontProxyKeys.indexOf(key) == -1) {
                    ret[key] = proxy.params[key];
                }
            }
            arr.push(ret);
        }, this);
        return JSON.stringify(arr);
    }

    public onResponse(data:Object):void {
        if (data) {
            this._responseData = data;
            if(this._responseData && this._responseData["s"] && this._responseData["s"] ==13){
                this._isRequestSucceed = true;
                this._isResponseSucceed = false;
                this._errorCode = -1000;
                doAction(ProxyAction.MULTIPROXY_ERROR, this);
                this.proxyDone();
                return;
            }
            this._subProxys.forEach((v:Proxy) => {
                var smod = v.getParamByName("mod");
                var sdo = v.getParamByName("do");
                v.onResponse(this.responseData[smod][sdo]);
            }, this);

            this._isRequestSucceed = true;
            this._isResponseSucceed = true;

            doAction(ProxyAction.MULTIPROXY_SUCCEED, this);

            this.dispatchEvent(new ProxyEvent(ProxyEvent.RESPONSE_SUCCEED, this));
            this.dispatchEvent(new ProxyEvent(ProxyEvent.REQUEST_SUCCEED, this));
        } else {
            this._isRequestSucceed = true;
            this._isResponseSucceed = false;

            this._errorCode = -1000;

            doAction(ProxyAction.MULTIPROXY_ERROR, this);

            this.dispatchEvent(new ProxyEvent(ProxyEvent.RESPONSE_ERROR, this));
            this.dispatchEvent(new ProxyEvent(ProxyEvent.REQUEST_SUCCEED, this));
            this.dispatchEvent(new ProxyEvent(ProxyEvent.ERROR, this));
        }
        this.proxyDone();
    }

    public get subProxyList():Array<SingleProxy> {
        return this._subProxys;
    }

    public getParamByName(name:string):any {
        for (var i = 0; i < this._subProxys.length; i ++) {
            var ret:any = this._subProxys[i].getParamByName(name);
            if (ret != null) {
                return ret;
            }
        }
        return null;
    }

    public addSubProxy(subProxy:any):void {
        if (subProxy && subProxy.hasOwnProperty("mod")) {
            var p1:SingleProxy = new SingleProxy(subProxy);
            this._subProxys.push(p1);
        } else if (subProxy instanceof SingleProxy) {
            this._subProxys.push(subProxy);
        } else if (subProxy instanceof MultiProxy) {
            var multiProxy:MultiProxy = <MultiProxy>subProxy;
            var that = this;
            multiProxy._subProxys.forEach(function(v) {
                that.addSubProxy(v);
            }, this);
        }
    }
}

class AutoMergeProxy extends MultiProxy {
    private _waitTime:number = 0;
    public constructor(time:any) {
        super();
        this._waitTime = time;
        egret.setTimeout(this.load, this, this._waitTime);
    }

    public load():void {
        AutoMergeProxy._cur = null;
        super.load();
    }

    private static _cur:AutoMergeProxy = null;
    public static getProxy():AutoMergeProxy {
        if (this._cur == null) {
            this._cur = new AutoMergeProxy(500);
        }
        return this._cur;
    }
}