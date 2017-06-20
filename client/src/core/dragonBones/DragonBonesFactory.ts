/**
 * Created by egret on 15-1-14.
 * DragonBones工厂类
 */
class DragonBonesFactory extends BaseClass{
    public averageUtils:AverageUtils;
    private factory:dragonBones.EgretFactory;
    private isPlay:boolean;
    private clocks:Array<dragonBones.WorldClock>;
    private clocksLen:number;
    private files:Array<string>;

    /**
     * 构造函数
     */
    public constructor(){
        super();
        this.averageUtils = new AverageUtils();
        this.factory = new dragonBones.EgretFactory();
        this.clocks = [];
        this.clocksLen = 0;
        this.files = [];
        //默认开启
        this.start();
        App.TimerManager.doTimer(5000, 0, this.checkDestroyCreateArmature, this);
    }

    /**
     * 初始化一个动画文件
     * @param skeletonData 动画描述文件
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public initArmatureFile(skeletonData:any, texture:egret.Texture, textureData:any):void{
        if(!skeletonData  || !texture || !textureData){
            egret.warn("**动画数据有误**",skeletonData,texture,textureData)
        }
        if(this.files.indexOf(skeletonData.name) != -1){
            return;
        }
        this.addSkeletonData(skeletonData);
        this.addTextureAtlas(texture, textureData);
        this.files.push(skeletonData.name);
    }

    /**
     * 同时移除动画文件和Res中文件
     * @param dbName
     */
    public removeArmatureFileAndRes(dbFileName:string):void{
        // if(this.removeArmatureFile(dbFileName)){
        //     if(RES.exists(dbFileName + "_skeleton_json"))
        //         RES.destroyRes(dbFileName+"_skeleton_json");
        //     RES.destroyRes(dbFileName+"_texture_png");
        //     RES.destroyRes(dbFileName+"_texture_json");
        //     if(RES.exists(dbFileName + "_ani"))
        //         RES.destroyRes(dbFileName+"_ani");
        // }

    }

    /**
     * 移除动画文件
     * @param name
     */
    public removeArmatureFile(name:string):boolean{
        var index:number = this.files.indexOf(name);
        if(index != -1){
            this.removeCreateArmatures(name);
            this.removeSkeletonData(name);
            this.removeTextureAtlas(name);
            animation.removeGroup(name);
            this.files.splice(index, 1);
            return true;
        }else
            return false;
    }

    private removeCreateArmatures(name:string){
        var keyArr = Object.keys(this.createArmatures);
        var keyArrLen = keyArr.length;
        for(var i=0; i<keyArrLen; i++){
            var key = keyArr[i];
            var fromFile = key.split(":")[0];
            if(fromFile == name){
                while(this.createArmatures[key] && this.createArmatures[key].length){
                    var arm:DragonBonesArmature = this.createArmatures[key][0];
                    arm.destroy();
                    arm = null;
                }
            }
        }
    }

    /**
     * 清空所有动画
     */
    public clear():void{
        while(this.files.length){
            this.removeArmatureFile(this.files[0]);
        }
    }

    /**
     * 添加动画描述文件
     * @param skeletonData
     */
    public addSkeletonData(skeletonData:any):void{
        this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
    }

    /**
     * 添加动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public addTextureAtlas(texture:egret.Texture, textureData:any):void{
        this.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    }

    /**
     * 移除动画描述文件
     * @param skeletonData
     */
    public removeSkeletonData(name:string):void{
        this.factory.removeSkeletonData(name);
    }

    /**
     * 移除动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public removeTextureAtlas(name:string):void{
        this.factory.removeTextureAtlas(name);
    }

    private createArmatures = {};
    private createArmaturesFromFileDic = {};

    /**
     * 创建一个动画（急速模式）
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    public makeFastArmature(name:string, fromDragonBonesDataName?:string, playSpeed:number = 1,needCache:boolean =false, isNew:boolean = false):DragonBonesArmature {
        if(isNew) {
            animation.addGroup(fromDragonBonesDataName + "_skeleton_ani", fromDragonBonesDataName + "_texture_png");
            var ani:any = animation.createAnimation(name, fromDragonBonesDataName);
            var clock:dragonBones.WorldClock = this.createWorldClock(playSpeed);
            var r = new DragonBonesArmature(ani, clock);
            r.fromFile = fromDragonBonesDataName;
            r.armatureName = name;
            r.lastUseTime = Math.floor(Date.now()/1000);
            var key = r.fromFile +":"+ name;
            if(!this.createArmatures[key]){
                this.createArmatures[key] = [];
            }
            if(!this.createArmaturesFromFileDic[r.fromFile]){
                this.createArmaturesFromFileDic[r.fromFile] = 0;
            }
            this.createArmatures[key].push(r);
            this.createArmaturesFromFileDic[r.fromFile] += 1;
            return r;
        }
        if(this.files.indexOf(fromDragonBonesDataName) == -1){
            var skeletonData:any = RES.getRes(fromDragonBonesDataName+"_skeleton_json");
            var texturePng:egret.Texture = RES.getRes(fromDragonBonesDataName+"_texture_png");
            var textureData:any = RES.getRes(fromDragonBonesDataName+"_texture_json");
            if(!skeletonData){
                egret.warn("动画文件："+ fromDragonBonesDataName +" 没有加载成功！！");
                return null;
            }
            this.initArmatureFile(skeletonData, texturePng, textureData);
        }

        //从RES中销毁skeleton_json
        var skeletonDataJson = fromDragonBonesDataName+"_skeleton_json";
        if(!isNew && RES.getRes(skeletonDataJson)){
            RES.destroyRes(skeletonDataJson);
        }

        var armature:dragonBones.FastArmature = this.factory.buildFastArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            egret.warn("不存在Armature： "+name);
            return null;
        }
        if(needCache){
            armature.enableAnimationCache(24);
        }
        var clock:dragonBones.WorldClock = this.createWorldClock(playSpeed);
        var result:DragonBonesArmature = new DragonBonesArmature(armature, clock);
        result.fromFile = fromDragonBonesDataName;
        result.armatureName = name;
        result.lastUseTime = Math.floor(Date.now()/1000);

        var key = result.fromFile +":"+ result.getArmature().name;
        if(!this.createArmatures[key]){
            this.createArmatures[key] = [];
        }
        if(!this.createArmaturesFromFileDic[result.fromFile]){
            this.createArmaturesFromFileDic[result.fromFile] = 0;
        }
        this.createArmatures[key].push(result);
        this.createArmaturesFromFileDic[result.fromFile] += 1;

        //console.log("创建DB: ", key, this.createArmatures[key].length - 1);
        return result;
    }

    public destroyCreateArmature(armature:DragonBonesArmature){
        var key = armature.fromFile +":"+ armature.getArmature().name;
        var arr = this.createArmatures[key];
        if(arr){
            for(var i=0,len=arr.length; i<len; i++){
                if(arr[i] == armature){
                    arr.splice(i, 1);
                    this.createArmaturesFromFileDic[armature.fromFile] -= 1;
                    //console.log("销毁DB: ", key, i);
                    break;
                }
            }

            if(arr.length == 0){
                this.createArmatures[key] = null;
                delete this.createArmatures[key];
            }

            if(this.createArmaturesFromFileDic[armature.fromFile] == 0){
                this.createArmaturesFromFileDic[armature.fromFile] = null;
                delete this.createArmaturesFromFileDic[armature.fromFile];
                //this.removeArmatureFile(armature.fromFile);
                //console.log("删除DbFile", armature.fromFile);
	        }
        }
    }

    private checkDestroyCreateArmature(){
        var curUseTime:number =  Math.floor(Date.now()/1000);
        var constTime = 5;

        var keys = Object.keys(this.createArmatures);
        var keysLen = keys.length;
        for(var i=0; i<keysLen; i++) {
            var key = keys[i];
            var dbFromFile = key.split(":")[0];
            var arr = this.createArmatures[key];
            if (!arr) {
                continue;
            }

            for (var j = arr.length - 1; j >= 0; j--) {
                var db = arr[j];
                if (db.stage) {
                    continue;
                }

                if (!db.autoDestroy) {
                    continue;
                }

                if (curUseTime - db.lastUseTime > constTime) {
                    db.destroy();
                    db = null;
                    //console.log("定时销毁DB: ", key, j);
                }
            }

            if (arr.length == 0) {
                this.createArmatures[key] = null;
                delete this.createArmatures[key];
            }

            if (this.createArmaturesFromFileDic[dbFromFile] <= 0) {
                this.createArmaturesFromFileDic[dbFromFile] = null;
                delete this.createArmaturesFromFileDic[dbFromFile];
                this.removeArmatureFileAndRes(dbFromFile);
                console.log("定时销毁DB文件: ", key);
            }
        }
    }

    /**
     * 创建WorldClock
     * @param playSpeed
     * @returns {dragonBones.WorldClock}
     */
    private createWorldClock(playSpeed:number):dragonBones.WorldClock{
        for(var i:number = 0; i<this.clocksLen; i++){
            if(this.clocks[i].timeScale == playSpeed){
                return this.clocks[i];
            }
        }
        var newClock:dragonBones.WorldClock = new dragonBones.WorldClock();
        newClock.timeScale = playSpeed;
        this.clocks.push(newClock);
        this.clocksLen = this.clocks.length;
        return newClock;
    }


    public test(playSpeed:number){
        for(var i:number = 0; i<this.clocksLen; i++){
            var clock:dragonBones.WorldClock = this.clocks[i];
            clock.timeScale = playSpeed;
        }
    }

    /**
     * dragonBones体系的每帧刷新
     * @param advancedTime
     */
    private onEnterFrame(advancedTime:number):void {
        this.averageUtils.push(advancedTime);
        var time:number = this.averageUtils.getValue() * 0.001;
        for(var i:number = 0; i<this.clocksLen; i++){
            var clock:dragonBones.WorldClock = this.clocks[i];
            clock.advanceTime(time);
        }
    }

    /**
     * 停止
     */
    public stop():void{
        if(this.isPlay){
            App.TimerManager.remove(this.onEnterFrame, this);
            this.isPlay = false;
        }
    }

    /**
     * 开启
     */
    public start():void{
        if (!this.isPlay) {
            this.isPlay = true;
            App.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
        }
    }
}