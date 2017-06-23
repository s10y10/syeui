/**
 * Created by brucex on 9/11/14.
 */
class GameAnimation {
    public _target:egret.DisplayObject;
    public _duration:number;
    private _overTime:number = 0;
    private _ease:Function;

    private _selector:Function;
    private _context:Object;
    private _args:any[];

    private _curSteps:number = 0;
    private _delay:number = 0;
    private _curDelay:number = 0;

    private _loop:boolean = false;

    public constructor(duration:number, ease:Function = null) {
        this._duration = duration;
        this._ease = ease;
    }


    private static animations:any = {};
    private static runAnimation(target:egret.DisplayObject, anim:GameAnimation):void {
        if (!GameAnimation.animations.hasOwnProperty(target.hashCode)) {
            GameAnimation.animations[target.hashCode] = [];
        }
        GameAnimation.animations[target.hashCode].push(anim);
    }

    public delay(delay:number):GameAnimation {
        this._delay = delay;
        this._curDelay = delay;
        return this;
    }

    public loop(loop:boolean):GameAnimation {
        this._loop = loop;
        return this;
    }

    public static clearTarget(target:egret.DisplayObject):void {
        if (typeof(target) != "undefined" && target != null && GameAnimation.animations.hasOwnProperty(target.hashCode)) {
            var anims:GameAnimation[] = GameAnimation.animations[target.hashCode];

            while (anims.length > 0) {
                anims.shift().dispose();
            }

            if (GameAnimation.animations[target.hashCode].length == 0) {
                delete GameAnimation.animations[target.hashCode];
            }
        }
    }

    public static clearAnimation(anim:GameAnimation):void {
        var target:egret.DisplayObject = anim.getTarget();
        if (typeof(target) != "undefined" && target != null && GameAnimation.animations.hasOwnProperty(target.hashCode)) {
            GameAnimation.animations[target.hashCode].removeValues(anim);
            anim.dispose();
            if (GameAnimation.animations[target.hashCode].length == 0) {
                delete GameAnimation.animations[target.hashCode];
            }
        }
    }

    private _tick(t:number):void {
        if (this._curDelay < this._delay) {
            this._curDelay += t;
            if (this._curDelay >= this._delay) {
                this._complete();
            }
            return;
        }

        this._overTime += t;
        t = this._overTime / this._duration;

        if (this._loop) {
            t = this._overTime % this._duration / this._duration;
        }

        t = t > 1 ? 1 : t;
        var t2:number = (t < 1 ? t : 1);
        t2 = t2 > 0 ? t2 : 0;
        if (this._ease) {
            t = this._ease(t2);
        }
        this.update(t);

        var steps:number = Math.floor(this._overTime / this._duration)

        if (steps > this._curSteps) {
            if (this._delay == 0) {
                this._complete();
            }

            this._curSteps = steps;
            this._curDelay = 0;
        }
    }

    private _complete():void {
        if (this._selector) {
            this._selector.apply(this._context, this._args);
        }
        this.onComplete();
        if (!this._loop) {
            GameAnimation.clearAnimation(this);
        }
    }

    public onComplete():void {
    }

    public getTarget():any {
        return this._target;
    }

    public onDispose():void {

    }

    public dispose():void {
        this.onDispose();
        egret.Ticker.getInstance().unregister(this._tick, this);
        this._selector = null;
        this._context = null;
        this._target = null;
    }

    public setComplete(selector:Function, context:Object = null, ...args):GameAnimation {
        this._selector = selector;
        this._context = context;
        this._args = args;
        return this;
    }

    public update(t:number):void {

    }

    public run(obj:any):void {
        this._run(obj);
    }

    public _run(target:egret.DisplayObject, isTicker:boolean = true):void {
        this._target = target;
        if (isTicker) {
            egret.Ticker.getInstance().register(this._tick, this);
        }
        GameAnimation.runAnimation(target, this);
    }
}