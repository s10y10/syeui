/**
 * Created by brucex on 7/8/15.
 */
class BlinkAnimation extends GameAnimation {
    private _totalDelay:number;
    private _curDuration:number = 0;
    public constructor(duration:number, delay:number = 41) {
        super(duration);
        this._totalDelay = delay;
    }

    public update(t:number):void {
        var curDuration:number = this._duration * t;
        if (curDuration >= this._curDuration + this._totalDelay) {
            this._target.visible = !this._target.visible;
            this._curDuration = curDuration;
        }
        super.update(t);
    }
}