/**
 * Created by brucex on 6/2/15.
 */
class ProxyAction {
    /**
     * 请求正在等待状态
     * @type {string}
     */
    public static WAIT:string = "proxy_status_wait";
    /**
     * 请求正在响应状态
     * @type {string}
     */
    public static RESPONSE:string = "proxy_status_response";
    /**
     * 开始加载
     * @type {string}
     */
    public static BEGIN_LOAD:string = "load_proxy";
    /**
     * 请求前状态
     * @type {string}
     */
    public static REQUEST:string = "proxy_status_reqeust";
    /**
     * 请求成功
     * @type {string}
     */
    public static REQUEST_SUCCEED:string = "proxy_request_succeed";
    /**
     * 请求响应成功
     * @type {string}
     */
    public static RESPONSE_SUCCEED:string = "proxy_response_succeed";
    /**
     * 请求失败
     * @type {string}
     */
    public static REQUEST_ERROR:string = "proxy_request_error";
    /**
     * 请求响应错误
     * @type {string}
     */
    public static RESPONSE_ERROR:string = "proxy_response_error";
    /**
     * 请求超时
     * @type {string}
     */
    public static TIMEOUT:string = "proxy_timeout";
    /**
     * 多请求响应错误
     * @type {string}
     */
    public static MULTIPROXY_ERROR:string = "multiproxy_response_error";
    /**
     * 多请求响应成功
     * @type {string}
     */
    public static MULTIPROXY_SUCCEED:string = "multiproxy_response_succeed";
}