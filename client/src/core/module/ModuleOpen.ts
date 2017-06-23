// TypeScript file
class ModuleOpen{
    public static openHomeScene():void{
        ModuleOpen.checkToOpen("HomeScene",GameContainerLayer.UI_COMMON_TYPE,1,2);
    }

    public static openBuildLayer():void{
        ModuleOpen.checkToOpen("HomeBuildLayer",GameContainerLayer.UI_BOX_TYPE);
    }

    public static checkToOpen(clsName:string, layer:string = "box", ...args):void {
        var proxy = ClassConfig.Proxies[clsName];
        var groups = ClassConfig.Groups[clsName] || [];
        args.splice(0, 0, [], groups, clsName, layer);
        if (proxy) {
            ModuleOpen.open(proxy.mod, ()=> {
                ModuleOpen.openAfterLoadComplete.apply(this, args);
            }, this, proxy.cache, proxy.mask,proxy.ref);
        } else {
            ModuleOpen.openAfterLoadComplete.apply(this, args);
        }
    }

    /*
     * ref 是否重新请求数据 {}， null 有缓存则读缓存
     * */
    public static open(mod_do:string, cf:any, ct:any, cache:boolean = true, mask:boolean = true,ref:any = null,p:any ={},reload:boolean=false) {
        if (!ref && ProxyCache.isCache(mod_do)) {
            cf && ct && cf.call(ct);
        } else {
            var proxy = new SingleProxy({"mod": mod_do, "p": p, cache: cache, mask: mask,reload:reload});
            proxy.addEventListener(ProxyEvent.RESPONSE_SUCCEED, function (e) {
                cf && ct && cf.call(ct,e);
            }, this);
            proxy.addEventListener(ProxyEvent.ERROR, ()=> {
                App.EasyLoading.hideLoading();
            }, this);
            proxy.load();
        }
    }

    /**
     * 在资源加载完成后打开页面
     * @param resource          未被归入组的单独素材元素集合
     * @param resourceGroups    要加载的素材组名集合
     * @param jmc               指定的jmc文件
     * @param layer             要承载的层级，参数值使用 GameContainer.UI_*
     * @param ...args           其他参数，用于向页面对象的updateViewByParams方法传参
     * */
    private static openAfterLoadComplete(resource:string[], resourceGroups:string[], clsName:string, layer:string = "box", ...args):any {
        args.splice(0, 0, clsName, layer);
        if (resource.length || resourceGroups.length) {
            App.EasyLoading.showLoading();
            App.ResourceUtils.loadResource(resource, resourceGroups, ()=> {
                App.EasyLoading.hideLoading();
                ModuleOpen.openHandler.apply(this, args);
            },(e0,e1=null,e2 =null)=>{
                //console.log(e0,e1,e2);
            }, this,1);
        } else {
            ModuleOpen.openHandler.apply(this, args);
        }
    }

    public static Caches = {};
    public static openHandler(clsName:string, layer:string = "box", ...args):any {
        var cls:any = egret.getDefinitionByName(clsName);
        var container = new cls();
        args.splice(0, 0, container, layer);
        App.GameContainerLayer.addToContainerByType.apply(App.GameContainerLayer,args);
        ModuleOpen.Caches[clsName] = container;
        if (container instanceof BaseBoxEuiView)
        {
            (<BaseBoxEuiView>container).showBoxAnimation();
        }
        return container;
    }

    public static clearCache(clsName:string):void{
        delete ModuleOpen.Caches[clsName];
    }
}

class ClassConfig {
    //页面需要的资源组
    public static Groups = {
        "HomeScene1":["home"],
    };

    //页面需要请求的后端接口
    public static Proxies = {
        "HomeScene1": {"mod": "User.getInfo", "cache": true,"ref":true,mask: true}
    };
}