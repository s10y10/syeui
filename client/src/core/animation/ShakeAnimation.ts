/**
 * Created by brucex on 9/12/14.
 */
class ShakeAnimation extends GameAnimation {
    private _strengthX:number = 0;
    private _strengthY:number = 0;
    private _count:number = 0;

    private static _original_position:any = {};

    public static reset():void {
        ShakeAnimation._original_position = {};
    }

    public constructor(duration:number, strengthX:number, strengthY:number, count:number = -1) {
        super(duration);
        this._count = count;
        this._strengthX = strengthX;
        this._strengthY = strengthY;
    }

    public update(t:number):void {
        var obj:any = ShakeAnimation._original_position[this._target.hashCode];
        if (obj) {
            var randX:number = NumberUtility.getRandomInt(-this._strengthX, this._strengthX);
            var randY:number = NumberUtility.getRandomInt(-this._strengthX, this._strengthX);;

            if (t == 1) {
                this._target.x = obj["pt"].x;
                this._target.y = obj["pt"].y;
                var idx:number = obj["ref"].indexOf(this);
                if (idx > -1) {
                    obj["ref"].splice(idx, 1);
                }
                if (obj["ref"].length == 0) {
                    delete ShakeAnimation._original_position[this._target.hashCode];
                }
            } else {
                this._target.x = obj["pt"].x + randX;
                this._target.y = obj["pt"].y + randY;
            }
        }
    }

    public run(target:egret.DisplayObject):void {

        var obj:any = ShakeAnimation._original_position;

        if (!obj.hasOwnProperty(target.hashCode)) {
            obj[target.hashCode] = {};
            obj[target.hashCode]["ref"] = [];
            obj[target.hashCode]["pt"] = new egret.Point(target.x, target.y);
        }
        obj[target.hashCode]["ref"].push(this);

        super._run(target);
    }
}