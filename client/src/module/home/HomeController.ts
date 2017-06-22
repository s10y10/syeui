class HomeController extends BaseClass{
    private _homeScene:HomeScene;
    constructor(){
        super();
    }

    public enterHomeScene():void{
        if(this._homeScene != null){
            App.EgretExpandUtils.removeFromParent(this._homeScene);
            this._homeScene = null;
        }
        ModuleOpen.openHomeScene();
    }
}