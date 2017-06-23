// TypeScript file
class HomeScene extends BaseEuiView{
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
    }
}