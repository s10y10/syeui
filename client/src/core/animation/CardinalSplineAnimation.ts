/**
 * Created by brucex on 9/12/14.
 */
class CardinalSplineAnimation extends GameAnimation {
    private _frameArray:any[] = [];
    private _delta:number = 0;
    private _tension:number = 0;

    public constructor(duration:number, tension:number = 0.1) {
        super(duration);
        this._tension = tension;
    }

    public addKeyFrame(obj:any) {
        this._frameArray.push(obj);
        this._delta = 1 / (this._frameArray.length - 1);
    }

    public update(t:number) {
        var p:number = 0;
        var lt:number = 0;

        if (t == 1) {
            p = this._frameArray.length - 1;
            lt = 1;
        } else {
            p = 0 | (t / this._delta);
            lt = (t - this._delta * p) / this._delta;
        }

        var obj:any = this.cardinalSplineAt(
            this.getConrolAt(this._frameArray, p - 1),
            this.getConrolAt(this._frameArray, p - 0),
            this.getConrolAt(this._frameArray, p + 1),
            this.getConrolAt(this._frameArray, p + 2),
            this._tension, lt
        );

        this.onUpdate(obj, t == 1);
    }

    public onUpdate(obj:any, finish:boolean):void {

    }

    private getConrolAt(controls:any[], pos:number):any {
        var p:number = Math.min(controls.length - 1, Math.max(pos, 0));
        return controls[p];
    }

    private cardinalSplineAt(p0:any, p1:any, p2:any, p3:any, tension:number, t:number):any {
        var t2:number = t * t;
        var t3:number = t2 * t;

        var s:number = (1 - tension) / 2;

        var b1:number = s * ((-t3 + (2 * t2)) - t);
        var b2:number = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);
        var b3:number = s * (t3 - 2  * t2 + t) + (-2 * t3 + 3 * t2);
        var b4:number = s * (t3 - t2);

        var obj:any = {};
        for (var key in p0) {
            var v:any = (p0[key] * b1 + p1[key] * b2 + p2[key] * b3 + p3[key] * b4);
            obj[key] = v;
        }
        return obj;
    }
}