/**
 * Created by yangsong on 15-1-23.
 * 引擎扩展类
 */
class EgretExpandUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 初始化函数
     */
    public init():void {
        AnchorUtil.init();
    }

    public removeFromParent(child:egret.DisplayObject):void{
        if(child instanceof BaseBoxEuiView){
            (<BaseBoxEuiView>child).closeBoxAnimation();
        }else{
            child && child.parent && child.parent.removeChild(child);
        }
    }
}