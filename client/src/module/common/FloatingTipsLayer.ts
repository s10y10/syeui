/**
 * Created with WebStorm.
 * User: yang
 * Date: 15-8-13
 * Time: 下午6:00
 * To change this template use File | Settings | File Templates.
 */
class FloatingTipsLayer extends BaseEuiView{
    public MessageLabel:eui.Label;
    public content:eui.Group;

    public static message:string = null;
    public static message2:string = null;
    private num:NumberContainer;
    public constructor() {
        super();
        this.skinName = "FloatingTipsLayerSkin";
    }

    public createComplete():void {
        TextFieldUtils.setStroke(this.MessageLabel);
    }
    public updateViewByParams(msg:string, type:number = 0):void {
        if(type==0)//文本
        {
            this.setMessage(msg);
        }else{
            this.MessageLabel.textFlow=(new egret.HtmlTextParser()).parser("");
            this.num = new NumberContainer("gold_");
            this.content.addChild(this.num);
            this.setImgMessage(msg);
        }
    }

    public setMessage(msg:string):void {
        if(FloatingTipsLayer.message2 == "-1"){
            this.MessageLabel.textFlow = (new egret.HtmlTextParser()).parser(msg);
            this.MessageLabel.size = 22;
        }else{
            this.MessageLabel.size = 20;
            this.MessageLabel.textFlow = (new egret.HtmlTextParser()).parser(msg);
        }
        var y:number= this.y;
        this.alpha = 0;
        this.y += 50;
        egret.Tween.get(this).to({y: y, alpha: 1}, 150).wait(FloatingTipsLayer.waitTime).to({alpha: 0}, 150).call(() => {
            App.EgretExpandUtils.removeFromParent(this);
            FloatingTipsLayer.message = null;
            FloatingTipsLayer.message2 = null;
        });
    }

    private static waitTime:number;
    public static show(msg: string,waitTime = 1000,msg2: string = "-1",repeat:Boolean=false):void {
        FloatingTipsLayer.waitTime = waitTime;
        if(FloatingTipsLayer.message != msg || repeat) {
            FloatingTipsLayer.message = msg;
            FloatingTipsLayer.message2 = msg2;
            ModuleOpen.openFloatingTipsLayer(msg);
        }
    }

    public static showImgNum(msg: string,waitTime = 1000,msg2: string = "-1",repeat:Boolean=false):void {
        FloatingTipsLayer.waitTime = waitTime;
        ModuleOpen.openFloatingTipsLayer(msg,1);
    }

    public setImgMessage(msg:string):void {
        var y:number= this.y;
        this.content.scaleY=0;
        this.content.scaleX=0;
        this.num.setNumber(msg,1);
        this.content.y = -200;
        this.num.x = -this.num.width >> 1;
         egret.Tween.get(this.content).to({scaleY:1.5,scaleX:1.5},300,egret.Ease.backOut).wait(400).to({scaleY:0,scaleX:0,alpha:0},300,egret.Ease.backIn).call(() => {
             FloatingTipsLayer.staticDispose();
             App.EgretExpandUtils.removeFromParent(this);
         });
    }

    public static staticDispose()
    {
        FloatingTipsLayer.message = null;
        FloatingTipsLayer.message2 = null;
    }
}
