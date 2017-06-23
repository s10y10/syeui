/**
 * Created by yangsong on 2014/11/22.
 * View基类，继承自eui.Component
 */
class BaseEuiView extends eui.Component {
    private _isDisposed:boolean = false;
    private _forceDispose:boolean = true;
    public constructor() {
        super();
        this.percentHeight = 100;
        this.percentWidth = 100;
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._base_onRemovedHandler, this);
    }

    private _base_onRemovedHandler(e:egret.Event):void {
        this.dispose();
    }

    protected childrenCreated():void{
        super.childrenCreated();
    }

    private removeRemovedFromStage(){
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._base_onRemovedHandler, this);
    }

    /**
     * 子类重写
     */
    public updateViewByParams(...arg):void{
    }

    public setVisible(boo:boolean):void{
        this.visible = boo;
    }

    public dispose():void {
        if (this._forceDispose) {
            this._isDisposed = true;
            this.removeRemovedFromStage();
            removeEventsByTarget(this);
            egret.Tween.removeTweens(this);
            ModuleOpen.clearCache(egret.getQualifiedClassName(this));
        }
    }
}