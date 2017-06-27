/**
 * Created by sy on 16/4/29.
 */
enum ConfirmType{
    cancel = 0,
    ok = 1,
}

class ConfirmData{
    constructor(public msg:string,public needCancel:boolean = true,public titleImageUrl:string = null){}
}

class ConfirmLayer extends BaseBoxEuiView
{
    private _callbackFun:any;
    private _callBackTarget:any;
    private _data:ConfirmData;

    public okButton:eui.Button;
    public cancelButton:eui.Button;
    public titleImg:eui.Image;
    public mesTxt:eui.Label;
    public bg:eui.Image;
    constructor()
    {
        super();
        this.skinName = "ConfirmLayerSkin";
    }

    public childrenCreated():void{
        super.childrenCreated();
        this.okButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.okHandler,this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHandler,this);
    }

    public updateViewByParams(cf,cb,data:ConfirmData){
        this._callbackFun = cf;
        this._callBackTarget = cb;
        this._data = data;

        if(!data.needCancel){
            this.cancelButton.visible = false;
            this.okButton.x = 230;
        }

        this.mesTxt.text = this._data.msg;
        this.bg.height = 170 + this.mesTxt.textHeight;

        if(data.titleImageUrl != null){
            this.titleImg.source = data.titleImageUrl;
            this.titleImg.visible = true;
        }else{
            this.titleImg.visible = false;
        }
    }

    public closeHandler(){
        this.callBack(ConfirmType.cancel);
    }

    public okHandler(){
        this.callBack(ConfirmType.ok);
    }

    public dispose():void {
        if(this._callbackFun)
        {
            this._callbackFun = null;
            this._callBackTarget = null;
        }
        this.okButton.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.okHandler,this);
        this.cancelButton.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHandler,this);
        super.dispose();
    }

    private callBack(type:ConfirmType) {
        if (this._callbackFun && this._callBackTarget) {
            this._callbackFun.call(this._callBackTarget,type);
        }
        App.EgretExpandUtils.removeFromParent(this);
    }
    
}