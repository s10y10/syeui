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
        this.login();
    }

    //登陆
    private login():void{
        var proxy = new SingleProxy({"mod": HttpConst.User_Login, "mask": true, "p": {"account":"syma1"}});
        proxy.addEventListener(ProxyEvent.RESPONSE_SUCCEED, (event:ProxyEvent)=>{
            var data:any = event.responseData["r"];
            App.hashKey = data["h"];
            GameUtils.serverTime = data["t"] || 0;
            this.getUserInfo();
        }, this);
        proxy.addEventListener(ProxyEvent.ERROR, (e)=> {
            //登录不成功
            console.log("登陆失败",e);
        }, this);
        proxy.load();
    }

    //获取用户信息
    private getUserInfo():void{
        /**
         * 这里存在请求先后顺序
         */
        var proxy = new MultiProxy(
            {"mod": HttpConst.User_GetInfo, "cache": true, "mask": true,},
            {"mod": HttpConst.Match_getTime, "cache": true, "mask": true}
        );
        proxy.addEventListener(ProxyEvent.RESPONSE_SUCCEED, (e:ProxyEvent)=>{
            this.onGetUserInfoSuccess(e);
        }, this);
        proxy.addEventListener(ProxyEvent.ERROR, (e)=>{
            console.log("数据请求失败，3秒后再次请求！！");
            FloatingTipsLayer.show(LanguageUtils.langueConfig["13"]);
            egret.Tween.get(this).wait(3000).call(()=>this.getUserInfo(), this);
        }, this);
        proxy.load();
    }

    private onGetUserInfoSuccess(data:any):void{
        this.enterHomeScene();
    }

    private enterHomeScene():void{
        App.EgretExpandUtils.removeFromParent(this);
        HomeController.getInstance().enterHomeScene();
    }
}