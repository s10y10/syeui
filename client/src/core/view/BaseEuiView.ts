/**
 * Created by yangsong on 2014/11/22.
 * View基类，继承自eui.Component
 */
class BaseEuiView extends eui.Component {
    private _isInit:boolean;
    private _resources:string[] = null;

    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
     */
    public constructor() {
        super();
        this._isInit = false;

        this.percentHeight = 100;
        this.percentWidth = 100;
    }

    /**
     * 设置初始加载资源
     * @param resources
     */
    public setResources(resources:string[]):void {
        this._resources = resources;
    }

    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    public isInit():boolean {
        return this._isInit;
    }

    /**
     * 面板是否显示
     * @return
     *
     */
    public isShow():boolean {
        return this.stage != null && this.visible;
    }

    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    public initUI():void {
        this._isInit = true;
    }

    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    public initData():void {

    }

    /**
     * 销毁
     */
    public destroy():void {
        this._resources = null;
    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param:any[]):void {

    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public close(...param:any[]):void {

    }

    /**
     /**
     * 加载面板所需资源
     */
    public loadResource(loadComplete:Function, initComplete:Function):void {
        if (this._resources && this._resources.length > 0) {
            App.ResourceUtils.loadResource(this._resources, [], loadComplete, null, this);
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    }

    /**
     * 设置是否隐藏
     * @param value
     */
    public setVisible(value:boolean):void {
        this.visible = value;
    }
}