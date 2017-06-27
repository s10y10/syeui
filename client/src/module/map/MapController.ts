// TypeScript file
class MapController extends BaseClass{
    private _mapScene:MapScene;
    constructor(){
        super();
        addAction(MapEvent.enterMapScene,this.enterMapScene,this);
    }
    
    //进入地图场景
    public enterMapScene():void{
        if(this._mapScene != null){
            App.EgretExpandUtils.removeFromParent(this._mapScene);
            this._mapScene = null;
        }
        ModuleOpen.openMapScene();
        this.addEvent();
    }

    private dispose():void{
        App.EgretExpandUtils.removeFromParent(this._mapScene);
        this._mapScene = null;
        this.removeEvent();
    }
    
    //去家园场景
    private gotoHomeScene():void{
        SceneAnimationManager.show(()=>{
            this.dispose();
            doAction(HomeEvent.enterHomeScene);
            SceneAnimationManager.hide(null,null);
        },this);
    }

    //添加事件侦听
    private addEvent():void{
        addAction(MapEvent.gotoHomeScene,this.gotoHomeScene,this);
    }

    //移除事件侦听
    private removeEvent():void{
        removeAction(MapEvent.gotoHomeScene,this.gotoHomeScene,this);
    }

    //保存变量
    public setMapScene(scene:MapScene):void{
        this._mapScene = scene;
    }
}