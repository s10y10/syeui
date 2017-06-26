/**
 * Created by edward on 15/11/13.
 */
class FilePath {
    public static IMGE_ItemPath = "assets/icon/item/";//道具图片路径
    public static File_OtherAnimPath = "resource/animation/other/";//其他动画路径

}

/*配置文件名*/
class ConfigNames {
    public static ERROR_CODE:string = "errorcode_json";//错误码配置
    public static BUILD:string = "build_json";//建筑数据
    public static SYSTEM:string = "system_json";//系统数据
}

class ResManager extends BaseClass {

    /**
     * 获取system配置
     */
    public getSys():any{
        return this.getConfigData(ConfigNames.SYSTEM)["Sheet1"];
    }

    /*
     * 获取 图标
     *   1:道具 2:建筑 3:岛 4:衣服们 5:城市缩略图
     * */
    public getIconByTypeAndID(type, cid = null, suffix = ".png") {
        switch (type) {
            case 1:
                return FilePath.IMGE_ItemPath + cid + suffix;
        }
    }
    //获取花费图标（在res表内的素材图片）
    //1 金币 2 钻石 3 体力 4 魅力  5 人民币 7 护盾 8 时装
    public getCostIconByTypeId(type): string {
        switch (type) {
            case 1: return "gold_png";
            case 2: return "zs_png";
            case 3: return "tl_png";
            case 4: return "heart1_png";
            case 5: return "xx_png";
            case 7: return "shield_png";
            case 8: return "xx_png";
        }
    }


    /**
     * 获取配置数据
     * @param jsonName 配置表名称
     * @param attrChain 要查询的属性链
     */
    public getConfigData(jsonName, ...attrChain) {
        jsonName.indexOf("_json") < 0 && (jsonName += "_json");
        var conf = RES.getRes(jsonName);
        while (attrChain.length) {
            conf = conf[attrChain.shift()];
        }
        return conf;
    }
}