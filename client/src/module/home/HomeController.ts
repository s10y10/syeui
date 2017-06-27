class HomeController extends BaseClass{
    private _homeScene:HomeScene;
    constructor(){
        super();
        addAction(HomeEvent.enterHomeScene,this.enterHomeScene,this);
    }

    //添加事件侦听
    public addEvent():void{
        addAction(HomeEvent.gotoMapScene,this.gotoMapScene,this);
    }

    //移除事件侦听
    public removeEvent():void{
        removeAction(HomeEvent.gotoMapScene,this.gotoMapScene,this);
    }

    //进入地图场景
    private gotoMapScene():void{
        SceneAnimationManager.show(()=>{
            this.dispose();
            App.MapController;
            doAction(MapEvent.enterMapScene);
            SceneAnimationManager.hide(null,null);
        },this);
    }

    //销毁元素
    private dispose():void{
        App.EgretExpandUtils.removeFromParent(this._homeScene);
        this._homeScene = null;
        this.removeEvent();
    }

    //进入家园场景
    private enterHomeScene():void{
        if(this._homeScene != null){
            App.EgretExpandUtils.removeFromParent(this._homeScene);
            this._homeScene = null;
        }
        ModuleOpen.openHomeScene();
        this.addEvent();
    }

    //保存变量
    public setHomeScene(scene:HomeScene):void{
        this._homeScene = scene;
    }
}