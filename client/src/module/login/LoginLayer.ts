// TypeScript file
class LoginLayer extends BaseEuiView{
    public okBtn:eui.Button;
    constructor(){
        super();
        this.skinName = "LoginLayerSkin";
    }

    protected childrenCreated():void{
        super.childrenCreated();

        this.okBtn.label = "";
        this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onOkHandler,this);
    }

    private onOkHandler(e:egret.TouchEvent):void{
        App.EgretExpandUtils.removeFromParent(this);
        HomeController.getInstance().enterHomeScene();
    }
}