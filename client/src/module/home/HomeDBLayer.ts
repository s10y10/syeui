// TypeScript file
class HomeDBLayer extends BaseBoxEuiView{
    public dbGroup:eui.Group;
    private _db:DragonBonesArmature;
    constructor(){
        super();
        this.skinName = "HomeDBLayerSkin";
    }

    protected childrenCreated():void{
        super.childrenCreated();

       App.DisplayUtils.addOneNotLoadArmature("buildup",()=>{
           this._db = App.DragonBonesFactory.makeFastArmature("jianfangyu","buildup",1,true,true);
           this._db.play("1",0);
           this.dbGroup.addChild(this._db);
       },this,false,FilePath.File_OtherAnimPath,null,true);
    }

    public dispose():void{
        super.dispose();
        if(this._db){
            this._db.destroy();
            this._db = null;
        }
    }
}