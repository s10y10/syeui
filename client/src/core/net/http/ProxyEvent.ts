/**
 * Created by brucex on 9/1/14.
 */

class ProxyEvent extends egret.Event {
    /**
     * 请求中断
     * @type {number}
     */
    public static CANCEL:string = "cancel";
    /**
     * 请求成功
     * @type {number}
     */
    public static REQUEST_SUCCEED:string = "requestSucceed";
    /**
     * 请求失败
     * @type {number}
     */
    public static REQUEST_FAIL:string = "fail";
    /**
     * 响应结果成功
     * @type {number}
     */
    public static RESPONSE_SUCCEED:string = "respnseSucceed";
    /**
     * 响应结果失败
     * @type {number}
     */
    public static RESPONSE_ERROR:string = "error";

    public static ERROR:string = "global_error";

    public static TIME_OUT:string = "timeout";

    private _responseData:Object;
    private _errorCode:number;
    private _errorMessage:string;
    private _isResponseSucceed:boolean;
    private _isRequestSucceed:boolean;

    public get responseData():Object {
        return this._responseData;
    }

    public get errorCode():number {
        return this._errorCode;
    }

    public get errorMessage():string {
        return this._errorMessage;
    }

    public get isResponseSucceed():boolean {
        return this._isResponseSucceed;
    }

    public get isRequestSucceed():boolean {
        return this._isRequestSucceed;
    }

    public constructor(type: string, target:Proxy, bubbles?: boolean, cancelable?: boolean) {
        super(type, bubbles, cancelable);
        this._responseData = target.responseData;
        this._errorCode = target.errorCode;
        this._errorMessage = target.errorMessage;
        this._isRequestSucceed = target.isRequestSucceed;
        this._isResponseSucceed = target.isResponseSucceed;
    }
}