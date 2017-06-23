// TypeScript file
class HomeMenu extends BaseEuiView{
    public buildBtn:eui.Button;
    constructor(){
        super();
    }

    protected childrenCreated():void{
        super.childrenCreated();
        this.buildBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBuildBtn,this);
    }

    private onClickBuildBtn():void{
        ModuleOpen.openBuildLayer();
    }
}