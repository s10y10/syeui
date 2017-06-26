/**
 * Created by sy on 2014/8/27.
 */

class NumberContainer extends egret.Sprite{

    private num:string="0";
    private numberLinkName:string;
    private numberArr:Array<egret.Bitmap> = [];
    private _needExtension:boolean;
    private _setPadding:any;
    constructor(linkName:string,needExtension:boolean = false,setPadding:any = null){
        super();
        this.numberLinkName = linkName;
        this._needExtension = needExtension;
        this._setPadding = setPadding;

        for(var i = 0;i<10;i++)
        {
            var numPic:egret.Bitmap = new egret.Bitmap();
            this.numberArr.push(numPic);
        }
    }
    /*
    * direction 翻转 1正向 -1 反向
    *
    * */
    public setNumber(num, direction:number = -1,leading:number = 0){
        if(num == undefined || num == this.num && this.num != "0")
            return;
        if(typeof num == "number")
            num = num.toString();
        this.num = num;
        var count:number = num.length;
        var strArr:string[] = num.split("");
        if(direction == -1)
        {
            strArr.reverse();
        }
        var gap = 0;
        var h:number = 0;
        var i;
        var bitmap:egret.Bitmap;
        while(this.numChildren > count){
            App.EgretExpandUtils.removeFromParent(this.$children[0]);
        }

        var extension:string = this._needExtension ? "_png" : "";
        for(i=0;i<this.numChildren;i++){
            bitmap = (<egret.Bitmap>this.getChildAt(i));
            bitmap.texture = App.CommonUtils.newGetTexture(this.numberLinkName + strArr[i] + extension);
            bitmap.x = gap * direction + leading;
            gap += (this._setPadding != null ? this._setPadding : bitmap.width);
            gap += leading;
        }

        for(i = this.numChildren;i<count;i++)
        {
            bitmap = this.getBitmap();
            bitmap.texture = App.CommonUtils.newGetTexture(this.numberLinkName + strArr[i] + extension);
            bitmap.x = gap * direction + leading;
            gap += (this._setPadding != null ? this._setPadding : bitmap.width);
            gap += leading;
            h = Math.max(bitmap.height, h);
            this.addChild(bitmap);
        }

        if(gap){
            this.width = gap;
            this.height = h;
        }
    }

    private getBitmap():egret.Bitmap{
        for(var i=0; i<10; i++){
            if(!this.numberArr[i].parent)
                return this.numberArr[i];
        }
    }

    public reSet(isSet:boolean = true)
    {
        while(this.$children.length){
            App.EgretExpandUtils.removeFromParent(this.$children[0]);
        }
        if(isSet)
        {
            this.setNumber("0");
        }
    }

    public getGetNumberCount():number{
        return this.numChildren;
    }

    public setNumberLinkName(value:string){
        this.numberLinkName = value;
    }
}
