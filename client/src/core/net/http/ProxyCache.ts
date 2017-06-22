/**
 * Created by brucex on 9/2/14.
 */
class ProxyCache extends egret.DisplayObject{
    private _cacheData:Object = {};
    public static _instance:ProxyCache = null;

    private static get instance():ProxyCache {
        if (!this._instance) {
            this._instance = new ProxyCache();
        }
        return this._instance;
    }

    public constructor(){
        super();
    }

    public reset():void {
        var slist:any = this._cacheData["Server"]["getList"];
        this._cacheData = {"Server": {"getList": slist}};
    }

    private setCache(proxy:Proxy):void {
        var params:Object = proxy.params;
        if (params.hasOwnProperty("cache") && params["cache"] === true) {
            var data = proxy.responseData;
            var smod = proxy.getParamByName("mod");
            var sdo = proxy.getParamByName("do");
            if (!this._cacheData.hasOwnProperty(smod)) {
                this._cacheData[smod] = {};
            }
            this._cacheData[smod][sdo] = data;
            doAction("Cache." + smod + "." + sdo, data);
            //doAction("All." + smod + "." + sdo);        //没有被侦听
            //doAction("cache_proxy_data", smod + "." + sdo);     //没有被侦听
        }
    }

    private getCache(smod:string = null, sdo:string = null):Object {
        if (smod == null) {
            return this._cacheData;
        }
        if (this.isCache(smod, sdo)) {
            var params:Array<string> = this.formatParmas(smod, sdo);
            return this._cacheData[params[0]][params[1]];
        }
        return null;
    }

    private formatParmas(smod:string, sdo:string = null):Array<string> {
        if (sdo == null) {
            var arr:Array<string> = smod.split(".");
            smod = arr[0];
            sdo = arr[1];
        }
        return [smod, sdo];
    }

    private isCache(smod:string, sdo:string = null):boolean {
        var params:Array<string> = this.formatParmas(smod, sdo);
        return this._cacheData.hasOwnProperty(params[0]) &&
                 this._cacheData[params[0]].hasOwnProperty(params[1]);
    }

    private clearCache(smod: string, sdo: string = null) {
        var params: string[] = this.formatParmas(smod, sdo);
        if (this._cacheData.hasOwnProperty(params[0]) && this._cacheData[params[0]].hasOwnProperty(params[1]))
            delete this._cacheData[params[0]][params[1]];
    }
    public static setCache(proxy:Proxy):void {
        ProxyCache.instance.setCache(proxy);
    }

    /**
     * 获取缓存数据
     * @param moddo
     * @returns {Object}
     */
    public static getCache(moddo:string = null):any {
        return ProxyCache.instance.getCache(moddo);
    }

    public static reset():void {
        return ProxyCache.instance.reset();
    }

    /**
     * 指定接口的数据是否已缓存
     * @param moddo
     * @returns {boolean}
     */
    public static isCache(moddo:string,pdo:string = null):boolean {
        return ProxyCache.instance.isCache(moddo,pdo);
    }

    public static clearCache(moddo: string, pdo: string = null) {
        ProxyCache.instance.clearCache(moddo, pdo);
    }
}