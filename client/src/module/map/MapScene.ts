// TypeScript file
class MapScene extends BaseEuiView{
    public homeBtn:eui.Button;
    constructor(){
        super();
        this.skinName = "MapSceneSkin";
    }

    public childrenCreated():void{
        super.childrenCreated();
        App.MapController.setMapScene(this);
        this.homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.homeHandler,this);
    }

    public dispose():void{
        super.dispose();
        this.homeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.homeHandler,this);
    }

    private homeHandler(e:egret.TouchEvent):void{
        doAction(MapEvent.gotoHomeScene);
    }
}