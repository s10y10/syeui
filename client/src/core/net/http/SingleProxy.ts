/**
 * Created by brucex on 9/1/14.
 */
class SingleProxy extends Proxy {
    public constructor(params:Object = {}) {
        super(params);
    }

    public getParamString(): string {
        var ret:any = {};
        for (var key in this._params) {
            if (Proxy.frontProxyKeys.indexOf(key) == -1) {
                ret[key] = this._params[key];
            }
        }
        return JSON.stringify(ret);
    }

    public load():void {
        if (this.getParamByName("autoMerge") == true) {
            AutoMergeProxy.getProxy().addSubProxy(this);
        } else {
            super.load();
        }
    }
}