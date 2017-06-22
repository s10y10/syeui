/**
 * Created by brucex on 9/1/14.
 */
class ProxyStatus {
    /**
     * 默认阶段
     * @type {number}
     */
    public static DEFAULT:number = 1 << 0;
    /**
     * 请求阶段
     * @type {number}
     */
    public static REQUEST:number = 1 << 1;
    /**
     * 请求中阶段
     * @type {number}
     */
    public static WAIT:number = 1 << 2;
    /**
     * 响应后阶段
     * @type {number}
     */
    public static RESPONSE:number = 1 << 3;
}