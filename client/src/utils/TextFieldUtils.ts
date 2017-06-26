/**
 * Created by brucex on 8/31/15.
 */
class TextFieldUtils {
    public constructor() {
    }

    //设置字体
    public static setFont(textFidld:egret.TextField,type:string):void
    {
        switch (type)
        {
            case LanguageUtils.fn1: textFidld.fontFamily = "simhei";
        }
    }

    //批量设置
    public static setStrokeArr(arr,stroke=2,strokeColor=0x000000):void
    {
        for (var i=0;i<arr.length;i++)
            this.setStroke(arr[i],stroke,strokeColor)
    }
    public static setStroke(textField:egret.TextField,stroke=2,strokeColor=0x000000,bold=false):void
    {
        if(textField){
            textField.stroke = stroke;
            textField.strokeColor = strokeColor;
            textField.bold = bold;
        }else {
            console.log("传入无效的 textfield！！！")
        }
    }

    /**
     * 字体样式
     * @param textFidld
     * @param color
     * @param strokeColor
     * @param stroke
     * @param fontType
     * @param bold
     */
    public static setStyle(textFidld: egret.TextField,color = 0x000000,strokeColor = 0,stroke = 1,fontType = LanguageUtils.fn1,bold = false):void
    {
        TextFieldUtils.setFont(textFidld,fontType);
        textFidld.textColor = color;
        textFidld.bold = bold;
        textFidld.strokeColor = strokeColor;
        textFidld.stroke = stroke;
    }
    
}