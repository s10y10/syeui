/**
 * 场景动画控制器
 * Created by coderk on 16/7/27.
 */
class SceneAnimationManager {

    private static _animation:DragonBonesArmature;
    private static _container:egret.DisplayObjectContainer;
    private static _key_show:string;
    private static _key_hide:string;
    private static _changing:boolean = false;
    private static _hiding:boolean = true;       //动画状态

    public static init(animation, container, key_show, key_hide){
        this._animation = animation;
        this._container = container;
        this._key_show = key_show;
        this._key_hide = key_hide;
    }

    public static show(callback, context=null){
        if(this._changing)
            return;
        if(this._hiding){
            this._changing = true;
            this._container.contains(this._animation) || this._container.addChild(this._animation);
            var complete = function (){
                this._hiding = this._changing = false;
                this._animation.removeCompleteCallFunc(complete, this);
                callback && callback.call(context);
            }
            this._animation.addCompleteCallFunc(complete, this);
            this._animation.play(this._key_show, 1);
        } else {
            callback && callback.call(context);
        }
    }

    public static hide(callback, context=null){
        if(this._changing)
            return;
        if(!this._hiding){
            this._changing = true;
            var complete = function(){
                this._hiding = true;
                this._changing = false;
                this._animation.removeCompleteCallFunc(complete, this);
                callback && callback.call(context);
                this._animation.parent && this._animation.parent.removeChild(this._animation);
            }
            this._animation.addCompleteCallFunc(complete, this);
            this._animation.play(this._key_hide, 1);
        } else {
            callback && callback.call(context);
        }
    }
    public static  isHiding(){
        return this._hiding;
    }
}