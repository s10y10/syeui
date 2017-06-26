/**
 * Created by yangsong on 2014/11/22.
 * View基类，继承自eui.Component
 */
class BaseBoxEuiView extends BaseEuiView {
    protected _boxAnim:IBoxAnimation;
    public closeButton:eui.Button;
    public BoxLayer:eui.Group;
    public MaskLayer:eui.Image;
    public constructor(anim:IBoxAnimation = null) {
        super();
        this._boxAnim = anim;
    }

    protected childrenCreated():void{
        super.childrenCreated();
        if (this.BoxLayer && this._boxAnim == null) {
            this._boxAnim = new BoxAnimation();
        }
        if(this.closeButton){
            this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseHandler,this);
        }
        if(this.MaskLayer){
            this.MaskLayer.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseHandler,this);
        }
    }

    private onCloseHandler(e:egret.TouchEvent):void{
        App.EgretExpandUtils.removeFromParent(this);
    }

    public dispose():void{
        super.dispose();
        if(this.closeButton){
            this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseHandler,this);
        }
        if(this.MaskLayer){
            this.MaskLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseHandler,this);
        }
    }

    public get boxDisplay():any {
        return this.BoxLayer;
    }

    public showBoxAnimation():void {
        if (this._boxAnim) {
            this._boxAnim.show(this, ()=>{
                if(this.hasEventListener("box_animation_done"))
                    this.dispatchEvent(new egret.Event("box_animation_done"));
                doAction("box_animation_done");
            }, this);
        }
    }

    public closeBoxAnimation():void {
        if (this._boxAnim) {
            this._boxAnim.close();
        } else {
            App.EgretExpandUtils.removeFromParent(this);
        }
    }
}