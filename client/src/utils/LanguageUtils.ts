// TypeScript file
class LanguageUtils{

   public static getText(id,...arg):string
    {
        var str:string = LanguageUtils.langueConfig[""+id];
        var len = arg.length;
        for(var i = 0;i<len;i++)
        {
            str = str.replace("%0%",arg[i]);
        }
        return str;
    }

    public static langueConfig = {
        "1":"功能未开启",
        "2":"倒计时: %0%  恢复%0%点体力",
        "3":"没有可攻击用户",
        "4":"攻击失败"
    }
}
    