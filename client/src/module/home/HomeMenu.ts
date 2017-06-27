// TypeScript file
class HomeMenu extends BaseEuiView{
    public buildBtn:eui.Button;
    public dbBtn:eui.Button;
    public confirmBtn:eui.Button;
    constructor(){
        super();
    }

    protected childrenCreated():void{
        super.childrenCreated();
        this.buildBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtnHandler,this);
        this.dbBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtnHandler,this);
        this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtnHandler,this);
    }

    private onClickBtnHandler(e:egret.TouchEvent):void{
        var btn:eui.Button = e.target;
        if(btn == this.buildBtn){
            ModuleOpen.openBuildLayer();
        }else if(btn == this.dbBtn){
            ModuleOpen.openDBLayer();
        }else if(btn == this.confirmBtn){
            ModuleOpen.openConfirmLayer((type:ConfirmType)=>{
            console.log(type);
            },this,new ConfirmData("我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容",false,"btn_qd1_png"))
        }
    }
}