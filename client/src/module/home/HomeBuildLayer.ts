// TypeScript file
class HomeBuildLayer extends BaseBoxEuiView{
    public btn1:eui.ToggleButton;
    public btn2:eui.ToggleButton;

    private _curTabIdx:number = 0;

    public itemList:eui.List;
    private collection:eui.ArrayCollection;

    constructor(){
        super();
        this.skinName = "HomeBuildLayerSkin";
    }

    protected childrenCreated():void{
        super.childrenCreated();
        var btn:eui.ToggleButton;
        for(var i:number = 1;i<=2;i++){
            btn = this["btn"+i];
            btn.name = "btn_"+i;
            btn.$autoSelected = false;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChangeTab,this);
        }
        this.collection = new eui.ArrayCollection();
        this.itemList.height = 530;
    }

    private onChangeTab(e:egret.TouchEvent):void{
        var idx = e.target.name.split("_")[1];
        this.onClick(idx);
    }

    private onClick(ids):void
    {
        if(this._curTabIdx == ids)return;
        this._curTabIdx = ids;
        this.refreshTabButtonState(ids);
        this.setList();
    }

    private setList():void{
        var config:any = RES.getRes("config_json")["build_json"]["d"]["build"];
        var arr:Array<any> = [];
        var isSingleKey:boolean;
        for(var key in config){
            isSingleKey = parseInt(key)%2==0;
            if((this._curTabIdx == 1 && isSingleKey) || (this._curTabIdx == 2 && !isSingleKey)){
                arr.push(config[key]);
            }
        }
        this.collection.source = arr;
        this.itemList.dataProvider = this.collection;
    }

    private refreshTabButtonState(selectedIndex:number):void
    {
        var btn:eui.ToggleButton;
        for(var i:number = 1;i<=2;i++) {
            btn = this["btn"+i];
            btn.selected = i == selectedIndex;
        }
    }

    public dispose():void{
        super.dispose();
        var btn:eui.ToggleButton;
        for(var i:number = 1;i<=2;i++){
            btn = this["btn"+i];
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChangeTab,this);
        }
    }

}