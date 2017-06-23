/**
 * Created by brucex on 9/25/14.
 */
class BoxAnimation implements IBoxAnimation {
    private _mask:egret.DisplayObject;
    private _box:egret.DisplayObject;
    private _container:egret.DisplayObjectContainer;

    private _boxOriginalScaleX:number;
    private _boxOriginalScaleY:number;

    private showAnimation(callback?, context?):void {
        if (this._mask) {
           // var oa:number = this._mask.alpha;
           // this._mask.alpha = 0;
           // egret.Tween.get(this._mask).to({alpha: oa}, 250);
        }

        this._boxOriginalScaleX = this._box.scaleX;
        this._boxOriginalScaleY = this._box.scaleY;
        var oa:number = this._box.alpha;
        this._box.scaleX = this._box.scaleY = this._box.alpha = 0;

        var tween = egret.Tween.get(this._box)
            .to({scaleX: this._boxOriginalScaleX, scaleY: this._boxOriginalScaleY, alpha: oa}, 400, egret.Ease.bounceInOut);
        callback && tween.call(callback, context);
    }

    public show(container:BaseBoxEuiView, callback?, context?):void {
        var _this = this;
        var onAdded;

        this._mask = container["maskDisplay"];
        this._box = container["boxDisplay"] || container;
        this._container = container;

        if (container.stage) {
            this.showAnimation(callback, context);
        } else {
            onAdded = function(){
                container.removeEventListener(egret.Event.ADDED_TO_STAGE, onAdded, _this);
                _this.showAnimation(callback, context);
            };
            container.addEventListener(egret.Event.ADDED_TO_STAGE, onAdded, _this);
        }
    }

    private remove():void {
        this._mask && egret.Tween.removeTweens(this._mask);
        this._box && egret.Tween.removeTweens(this._box);
        if(this._container){
            App.DisplayUtils.removeFromParent(this._container);
            this._container = null;
        }
    }

    public close():void {
        if (this._mask) {
            egret.Tween.get(this._mask).to({alpha:0}, 150);
        }
        if(!this._box){
            this.remove();
            return;
        }
        egret.Tween.get(this._box).wait(80).to({alpha: 0 },60);
        egret.Tween.get(this._box).to({scaleX: this._boxOriginalScaleX / 2, scaleY: this._boxOriginalScaleY / 2}, 150, egret.Ease.backIn).call(() => {
            this.remove();
        });
    }
}