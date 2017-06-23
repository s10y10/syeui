/**
 * Created by brucex on 6/8/15.
 */
class NumberUtility {
    public static getRandomInt(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getRandomArbitrary(min:number, max:number):number {
        return Math.random() * (max - min) + min;
    }

    public static hasNumber(a:number, t:number):boolean {
        var r:any = a & t;
        return r > 0;
    }

    public static getKNum(num:any):string{
        var s:string = num + "";
        s = s.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1d');
        return s;
    }

    public static getSortNum(num:number):string{
        if(num >= Math.pow(1000,2)*10){
            return Math.floor(num/Math.pow(1000,2)) + "M";
        }else if(num >= 1000*10){
            return Math.floor(num/1000) + "K";
        }else{
            return num.toString();
        }
    }
}