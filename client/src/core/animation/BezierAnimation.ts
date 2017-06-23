/**
 * Created by brucex on 9/11/14.
 */
class BezierAnimation extends GameAnimation {
    private _points:egret.Point[] = [];

    private _canRotate:boolean;

    public constructor(duration:number, canRotate:boolean = true, ease:Function = null) {
        super(duration, ease);
        this._canRotate = canRotate;
    }

    public appendPoint(pt:egret.Point):BezierAnimation {
        if (this._points.length < 4)  {
            this._points.push(pt);
        }
        return this;
    }

    public appendXY(x:number, y:number):BezierAnimation {
        if (this._points.length < 4) {
            this._points.push(new egret.Point(x, y));
        }
        return this;
    }

    public update(t:number):void {
        if (this._points.length == 4) {
            var x = Math.pow((1 - t), 3) * this._points[0].x + 3 * this._points[1].x * t * (1 - t) * (1 - t) + 3 * this._points[2].x * t * t * (1 - t) + this._points[3].x * Math.pow(t, 3);
            var y = Math.pow((1 - t), 3) * this._points[0].y + 3 * this._points[1].y * t * (1 - t) * (1 - t) + 3 * this._points[2].y * t * t * (1 - t) + this._points[3].y * Math.pow(t, 3);

            this._target.x = x;
            this._target.y = y;

            if (this._canRotate) {
                this._target.rotation = BezierAnimation.getDegress(t, this._points[0], this._points[1], this._points[2], this._points[3]);
            }
        }
        super.update(t);
    }

    public onComplete():void {
        super.onComplete();
    }

    public run(target:egret.DisplayObject):void {
        super._run(target);
    }

    public static getDegress(t:number, p1:egret.Point, p2:egret.Point, p3:egret.Point, p4:egret.Point):number {
        var Q0:egret.Point = new egret.Point((1 - t) * p1.x + t * p2.x, (1 - t) * p1.y + t * p2.y);
        var Q1:egret.Point = new egret.Point((1 - t) * p2.x + t * p3.x, (1 - t) * p2.y + t * p3.y);
        var Q2:egret.Point = new egret.Point((1 - t) * p3.x + t * p4.x, (1 - t) * p3.y + t * p4.y);

        var R0:egret.Point = new egret.Point((1 - t) * Q0.x + t * Q1.x, (1 - t) * Q0.y + t * Q1.y);
        var R1:egret.Point = new egret.Point((1 - t) * Q1.x + t * Q2.x, (1 - t) * Q1.y + t * Q2.y);

        var dx = R1.x - R0.x;
        var dy = R0.y - R1.y;

        var radians:number = Math.atan2(-dy, dx);
        var degrees:number = radians * 180 / Math.PI;

        return degrees;
    }
}