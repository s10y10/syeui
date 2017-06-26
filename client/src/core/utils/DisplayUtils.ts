/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
class DisplayUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public createBitmap(resName:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    }

    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {egret.Bitmap}
     */
    public createEuiImage(resName:string):eui.Image {
        var result:eui.Image = new eui.Image();
        var texture:egret.Texture = RES.getRes(resName);
        result.source = texture;
        return result;
    }

    /**
     * 从父级移除child
     * @param child
     */
    public removeFromParent(child:egret.DisplayObject) {
        if (child.parent == null)
            return;

        if (child.parent["removeElement"]) {
            child.parent["removeElement"](child);
        } else {
            child.parent.removeChild(child);
        }
    }

    /*
     * 读取跨域图片 头像
     * */
    public loadCrossImg(content,imgUrl,show= true){
        if(!imgUrl) return;
        if(egret.Capabilities.renderMode != "webgl"){
            content.visible = show;
            content.startLoad(imgUrl);
            content.gameAnchorX =content.gameAnchorY = 0.5;
            return;
        }
        var image = new Image();
        image.crossOrigin = "*";
        image.src = imgUrl;
        image.onload = function(){
            var base64 = DisplayUtils.getBase64Image(image);
            var texture = App.DisplayUtils.getTextureByBase64(base64);
            var b = new egret.Bitmap(texture);
            b.anchorOffsetX  = b.width>>1;
            b.anchorOffsetY  = b.height>>1;
            var index:number = content.parent.getChildIndex(content);
            content.parent.addChildAt(b,index);
            content.visible = false;
        }
    }

    public static getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
    }

    /**
     * @param base64 字符串
     */
    public  getTextureByBase64(base64: string):egret.Texture {
        var img: HTMLImageElement = new Image();
        img.src = base64;
        var texture = new egret.Texture();
        texture._setBitmapData(new egret.BitmapData(img));
        return texture;
    }


    /*
    * 加载指定龙骨动画
    * */
    public addOneNotLoadArmature(fileName:string,completeFun:Function,thisObject:any,showLoading,path,otherArr:any = null, isNew = false){
        if(showLoading){
            App.EasyLoading.showLoading();
        }
        App.ResourceUtils.CreateResourceConfigForDB(fileName,path,isNew);
        var resArr:any = App.ResourceUtils.getDBResourceArr([fileName], isNew);
        if(otherArr){
            resArr = resArr.concat(otherArr);
        }

        App.ResourceUtils.loadResource(resArr, [], ()=>{
            if(showLoading)
            {
                App.EasyLoading.hideLoading();
            }
            completeFun.apply(thisObject,[fileName]);//,content,source
        }, null, this);
    }
}
