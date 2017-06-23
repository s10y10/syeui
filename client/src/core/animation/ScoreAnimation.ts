/**
 * Created by brucex on 9/11/14.
 */
class ScoreAnimation extends GameAnimation {
    private _beginScore:number = 0;
    private _endScore:number = 0;
    private _format:string = null;

    public constructor(duration:number, beginScore:number, endScore:number, format:string = null, ease:any = null) {
        super(duration, ease);
        this._beginScore = beginScore;
        this._endScore = endScore;
        this._format = format;
    }

    public update(t:number) {
        var tf:egret.TextField = <egret.TextField>this._target;
        var score:any = Math.floor(this._beginScore + (this._endScore - this._beginScore) * t);
        if (t == 1) {
            score = this._endScore;
        }
        if ((score + "").indexOf(".") > -1) {
            score = score.toFixed(1);
        }
        if (this._format != null) {
            tf.text = this._format.replace("{num}", score);
        } else {
            tf.text = score.toString();
        }
        super.update(t);
    }

    public run(tf:egret.TextField):void {
        super._run(tf);
    }
}