// TypeScript file
class HomeScene extends BaseEuiView{
    public img:eui.Image;
    constructor(){
        super();
        this.skinName = "HomeSceneSkin";
    }

    public updateViewByParams(a,b):void{
        super.updateViewByParams();
        console.log(a,b);
    }

    public childrenCreated():void{
        super.childrenCreated();
        App.HomeController.setHomeScene(this);
        this.img.touchEnabled = false;
    }
}