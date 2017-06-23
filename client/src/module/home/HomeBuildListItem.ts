// TypeScript file
class HomeBuildListItem extends eui.ItemRenderer{
    public nameLabel:eui.Label;
    constructor(){
        super();
    }

    protected childrenCreated():void{
        super.childrenCreated();
    }

    public dataChanged():void{
        super.dataChanged();
        console.log(this.itemIndex,this.data);
        this.nameLabel.text = this.data["build"];
    }

}