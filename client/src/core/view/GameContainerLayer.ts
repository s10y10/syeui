/**
 * Created by edward on 14-8-11.
 */
class GameContainerLayer extends eui.UILayer {

    public static UI_TIP_TYPE:string = "tip";
    public static UI_GUIDE_TYPE:string = "guide";
    public static UI_TOOLTIP_TYPE:string = "tooltip";
    public static UI_TOP_BOX_TYPE:string = "topBox";
    public static UI_BOX_TYPE:string = "box";
    public static UI_COMMON_TYPE:string = "common";
    public static UI_MODULE_TYPE:string = "module";
    private _tipLayer:egret.DisplayObjectContainer;
    private _guideLayer:egret.DisplayObjectContainer;
    private _tooltipLayer:egret.DisplayObjectContainer;
    private _topBoxLayer:egret.DisplayObjectContainer;
    private _boxLayer:egret.DisplayObjectContainer;
    private _commonLayer:egret.DisplayObjectContainer;
    private _moduleLayer:egret.DisplayObjectContainer;
    constructor() {
        super();
    }
    private static _instance:GameContainerLayer;

    public static getInstance():any {
        if (GameContainerLayer._instance == null) {
            GameContainerLayer._instance = new GameContainerLayer();
            GameContainerLayer._instance.init();
        }
        return GameContainerLayer._instance;
    }

    private init():void {
        this.percentWidth = 100;
        this.percentHeight = 100;
        this._commonLayer = this.createContainer("common");
        this._moduleLayer = this.createContainer("modulebox");
        this._boxLayer = this.createContainer("box");
        this._topBoxLayer = this.createContainer("topbox");
        this._tooltipLayer = this.createContainer("tooltip");
        this._guideLayer = this.createContainer("guide");
        this._tipLayer = this.createContainer("tip");
    }

    private createContainer(name:string = null):eui.UILayer {
        var ret:eui.UILayer = new eui.UILayer();
        ret.touchEnabled = false;
        ret.percentHeight = 100;
        ret.percentWidth = 100;
        this.addChild(ret);
        if (name != null) {
            ret.name = name;
            ret["objTypeName"] = "layer";
        }
        return ret;
    }

       /*
    * 获取指定的顶级容器
    * */
    public getLayerByType(type){
        var layer;
        switch (type) {
            case GameContainerLayer.UI_TIP_TYPE:
                layer = this._tipLayer;
                break;
            case GameContainerLayer.UI_GUIDE_TYPE:
                layer = this._guideLayer;
                break;
            case GameContainerLayer.UI_TOOLTIP_TYPE:
                layer = this._tooltipLayer;
                break;
            case GameContainerLayer.UI_BOX_TYPE:
                layer = this._boxLayer;
                break;
            case GameContainerLayer.UI_TOP_BOX_TYPE:
                layer = this._topBoxLayer;
                break;
            case GameContainerLayer.UI_COMMON_TYPE:
                layer = this._commonLayer;
                break;
            case GameContainerLayer.UI_MODULE_TYPE:
                layer = this._moduleLayer;
                break;
        }
        return layer;
    }

    public addToContainerByType(view:BaseEuiView,type,...args):void{
        var layer:eui.UILayer = this.getLayerByType(type);
        layer.addChild(view);
        view.updateViewByParams.apply(view,args);
    }

    public cleanLayer(type) {
        var layer:eui.UILayer = this.getLayerByType(type);
        layer.removeChildren();        
    }
}