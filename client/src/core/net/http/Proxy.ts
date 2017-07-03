/**
 * Created by brucex on 9/1/14.
 */

class ProxyErrorCode {
    public static ERROR_DATA:number = -3;
    public static TIME_OUT:number = -4;
    public static ERROR_REQUEST:number = -5;
}

class Proxy extends egret.EventDispatcher {
    private static _waiting = [];
    private static _loading = [];

    public static get proxyOnLoading():Proxy[]{
        return this._loading.slice();
    }

    private static checkToLoad(proxy: Proxy) {
        if (Proxy._loading.length >= 1) {
            //if (!Proxy._waiting.length || Proxy._waiting[Proxy._waiting.length - 1].getParamString() != proxy.getParamString())
                Proxy._waiting.push(proxy) > 3
                    && console.warn("阻塞风险：当前正在等待发出的请求数量为 " + Proxy._waiting.length);
        } else {
            Proxy.addToLoading(proxy);
        }
    }

    private static onLoadingEnd(evt) {
        var proxy = evt.target;
        Proxy.removeFromLoading(proxy);
        if (Proxy._waiting.length)
            Proxy.addToLoading(Proxy._waiting.shift());
    }

    private static addToLoading(proxy) {
        Proxy._loading.push(proxy);
        proxy.addEventListener(ProxyEvent.ERROR, Proxy.onLoadingEnd, this);
        proxy.addEventListener(ProxyEvent.REQUEST_SUCCEED, Proxy.onLoadingEnd, this);
        proxy.loadHandler();
    }

    private static removeFromLoading(proxy) {
        proxy.removeEventListener(ProxyEvent.ERROR, Proxy.onLoadingEnd, this);
        proxy.removeEventListener(ProxyEvent.REQUEST_SUCCEED, Proxy.onLoadingEnd, this);
        var index = Proxy._loading.indexOf(proxy);
        index >= 0 && Proxy._loading.splice(index, 1);
    }
    public _params:Object;
    public _responseData:Object;
    public _errorCode:number;
    public _errorMessage:string;
    public _isResponseSucceed:boolean;
    public _isRequestSucceed:boolean;
    public _customParams:Object;
    public _status:number;
    public _requestUrl:string;

    public static frontProxyKeys:string[] = ["mask", "cache", "autoMerge"];

    private static _timeout:number = 30000;

    private _isTimeout:boolean = false;
    private _timeoutId:number = null;

    public showMsg: boolean = true;
    public mask: boolean = true;

    private _reloadTimes:number = 0;
    private _isIOError:boolean = false;

    public constructor(params: Object = {}) {
        super();
        this._customParams = {};
        this._params = this.formatParams(params);

        if (this._params) {
            if (this._params.hasOwnProperty("mask")) {
                this.mask = this._params["mask"];
                delete this._params["mask"];
            }
            if (this._params.hasOwnProperty("showMsg")) {
                this.showMsg = this._params["showMsg"];
                delete this._params["showMsg"];
            }
        }
    }

    private formatParams(params:Object):Object {
        if (params && !params.hasOwnProperty("do") && params.hasOwnProperty("mod")) {
            var mod = params["mod"];
            if (mod.indexOf(".") > -1) {
                var modarr:Array<any> = mod.split(".");
                params["mod"] = modarr[0];
                params["do"] = modarr[1];
            }
        }
        return params;
    }

    public get requestUrl():string {
        return this._requestUrl;
    }

    public set requestUrl(value:string) {
        this._requestUrl = value;
    }

    private paramsToQueryString(...args):string {
        var params:Array<string> = [];
        for (var i:number = 0; i < args.length; i ++) {
            var item:Object = args[i];
            for (var key in item) {
                params.push(key + "=" + item[key]);
            }
        }
        return params.join("&");
    }

    private loadHandler() {
        if(!this._requestUrl){
            // this._requestUrl = "http://dev-games.egret-labs.org:43000/api";
            this._requestUrl = "http://10.0.7.218:8080/api";
        }

        var url: string = this._requestUrl.indexOf("?") == -1 ? this._requestUrl + "?" : this._requestUrl;
        if (url[url.length - 1] != "?" && url[url.length - 1] != "&") {
            url += "&";
        }
        var filterResult:any = applyFilters(ProxyAction.BEGIN_LOAD, this);
        this._status = ProxyStatus.REQUEST;
        doAction(ProxyAction.REQUEST, this);
        if (filterResult === this || filterResult === true) {
            this._status = ProxyStatus.WAIT;
            doAction(ProxyAction.WAIT, this);

            var hashKey:string = App.hashKey;
            var paramsString:string = this.getParamString();
            var md5OriginalStr:string = paramsString + "xsanguox888~1f2a3";
            var s = new md5().hex_md5(md5OriginalStr);
            this.addParam("s", s);
            this.addParam("sn", encodeURIComponent(applyFilters("aes_encrypt", s, this.randomStr()).toString()));
            var params:Object = {"h": hashKey, "data": paramsString};

            this._isIOError = false;

            var queryString:string = this.paramsToQueryString(params, this._customParams, Proxy._globalParams);
            url += queryString;
            var request = new egret.URLRequest();
            request.method = egret.URLRequestMethod.GET;//POST
            request.data=new egret.URLVariables(url.substring(url.lastIndexOf("?") + 1, url.length));
            request.url = url.substring(0, url.lastIndexOf("?"));

            var loader = new egret.URLLoader();
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            loader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);

            this._timeoutId = egret.setTimeout(() => {
                loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
                loader.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);

                console.log("==================================================================");
                console.log("timeout!!!!!!!!!");
                console.log("==================================================================");

                this._errorCode = ProxyErrorCode.TIME_OUT;
                this._errorMessage = LanguageUtils.langueConfig["221"];
                this._isTimeout = true;
                // FloatingTipsLayer.show(this._errorMessage, 4000);
                doAction(ProxyAction.TIMEOUT, this);
                this.dispatchEvent(new ProxyEvent(ProxyEvent.TIME_OUT, this));
                this.dispatchEvent(new ProxyEvent(ProxyEvent.ERROR, this));
            }, this, Proxy._timeout);

            loader.load(request);
        }
    }

    public clearTimeoutHandler():void{
        this._timeoutId && egret.clearTimeout(this._timeoutId);
    }

    public load(): void {
        Proxy.checkToLoad(this);
    }

    //随机字符串，用于前后端验证请求
    private randomStr(): string {
        var num1 = Math.floor(Math.random() * 8999) + 1000;
        var num2 = Math.floor(Math.random() * 8999) + 1000;
        var num3 = num1 + num2;

        var strArr1 = num1.toString().split("");
        var strArr2 = num2.toString().split("");
        var strArr3 = num3.toString().split("");

        var tempStr = "";
        while (strArr3.length) {
            if (strArr1.length)
                tempStr += strArr1.shift();
            if (strArr2.length)
                tempStr += strArr2.shift();
            tempStr += strArr3.shift();
        }
        tempStr = parseInt(tempStr).toString(16);
        tempStr = tempStr.substr(0, 4) + Date.now().toString(16) + tempStr.substr(4);
        return tempStr;
    }
    public get isTimeout():boolean {
        return this._isTimeout;
    }

    public proxyDone():void {
        var isReload:boolean = this.getParamByName("reload") == true;
        if (!isReload || (isReload && this._isResponseSucceed)) {
            this.clearEventListener();
        }
        else if(this._isIOError) {
            if(this._reloadTimes == 4)
            {
                console.log("重试达到四次");
                this.clearEventListener();
            }
            else {
                egret.setTimeout(this.load,this,3000);
            }
            this._reloadTimes++;
        }
    }

    public onError(event:egret.IOErrorEvent):void {
        console.log("==================================================================");
        console.log("onError!!!!!!!!!");
        console.log("==================================================================");

        this._isRequestSucceed = false;
        this._isIOError = true;
        this._errorMessage = LanguageUtils.langueConfig["136"];
        this._errorCode = ProxyErrorCode.ERROR_REQUEST;
        egret.clearTimeout(this._timeoutId);
    
        this.dispatchEvent(new ProxyEvent(ProxyEvent.REQUEST_FAIL, this));
        this.dispatchEvent(new ProxyEvent(ProxyEvent.ERROR, this));
        doAction(ProxyAction.REQUEST_ERROR, this);
        doAction(ProxyAction.RESPONSE, this);
        this.proxyDone();
    }

    public onResponse(data:Object):void {
        this._responseData = data;
        this._isResponseSucceed = false;
        this._status = ProxyStatus.RESPONSE;

        if (this._responseData && this._responseData.hasOwnProperty("s")) {
            this._isResponseSucceed = this._responseData["s"] == 0;
        }
        if(this._responseData && this._responseData.hasOwnProperty("code")){
            this._isResponseSucceed = this._responseData["code"] == 0;
            this._responseData["s"] = this._responseData["code"];

        }
        this.dispatchEvent(new ProxyEvent(ProxyEvent.REQUEST_SUCCEED, this));
        this._errorCode = this._responseData ? this._responseData["s"] : ProxyErrorCode.ERROR_DATA;
        this._errorMessage =this._responseData["msg"];
        this._isRequestSucceed = true;

        doAction(ProxyAction.REQUEST_SUCCEED, this);
        doAction(ProxyAction.RESPONSE, this);

        if (this._isResponseSucceed) {
            doAction(ProxyAction.RESPONSE_SUCCEED, this);
            this.dispatchEvent(new ProxyEvent(ProxyEvent.RESPONSE_SUCCEED, this));
        } else {
            GameUtils.showErrorMess(this);
            doAction(ProxyAction.RESPONSE_ERROR, this);
            this.dispatchEvent(new ProxyEvent(ProxyEvent.RESPONSE_ERROR, this));
            this.dispatchEvent(new ProxyEvent(ProxyEvent.ERROR, this));
        }
        this.proxyDone();
    }

    public onComplete(event:egret.Event):void {
        egret.clearTimeout(this._timeoutId);
        var loader:egret.URLLoader = <egret.URLLoader>event.target;
        var data:any = null;
        try {
            data = MyJSON.parse(loader.data,"Proxy: requestUrl:" +  this.requestUrl);
        } catch (e) { }
        this.onResponse(data);
    }

    private getURLVariables(params:Object):egret.URLVariables {
        var list:Array<any> = [];
        for (var key in params) {
            list.push(key + "=" + params[key]);
        }
        var str:string = list.join("&");
        return new egret.URLVariables(str);
    }

    public getParamByName(name:string):any {
        if (!this._params) {
            return null;
        }
        return this._params[name];
    }

    public hasParamByName(name:string):boolean {
        if (!this._params) {
            return false;
        }
        return this._params.hasOwnProperty(name);
    }

    public get params():Object {
        return this._params;
    }


    public get responseData():Object {
        return this._responseData;
    }

    public get isResponseSucceed():boolean {
        return this._isResponseSucceed;
    }

    public get isRequestSucceed():boolean {
        return this._isRequestSucceed;
    }

    public get errorMessage():string {
        return this._errorMessage;
    }

    public get errorCode():number {
        return this._errorCode;
    }

    public addParam(key:string, value:any):void {
        this._customParams[key] = value;
    }

    public getParamString():string {
        return null;
    }

    private _listeners:any[] = [];

    public addEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false, priority:number = 0):void {
        super.addEventListener(type, listener, thisObject, useCapture, priority);
        this._listeners.push({'type': type, 'listener': listener, 'thisObj': thisObject, 'capture': useCapture, 'priority': priority});
    }

    public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void{
        super.removeEventListener(type, listener, thisObject, useCapture);
        var length = this._listeners.length;
        for (var i = length-1; i >= 0; i--) {
            var bin = this._listeners[i];
            if (bin.type == type && bin.listener == listener && bin.thisObj == thisObject) {
                this._listeners.splice(i, 1);
            }
        }
    }

    public clearEventListener():void {
        while (this._listeners.length > 0) {
            var obj:any = this._listeners[0];
            this.removeEventListener(obj['type'], obj['listener'], obj['thisObj'], obj['capture']);
        }
    }

    private static _globalParams:Object = {};

    public static addGlobalParams(key:string, params:Object):void {
        this._globalParams[key] = params;
    }

    public static getGlobalParam(key:string):any {
        return this._globalParams[key];
    }

    public static removeGlobalParams(key:string): void {
        delete this._globalParams[key];
    }
}