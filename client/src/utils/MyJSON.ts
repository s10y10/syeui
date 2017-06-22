/**
 * Created by sy on 17/3/31.
 */
class MyJSON{
    public static init(){
        var JsonParse = JSON.parse;
        JSON.parse = function(text){
            if(!text){
                console.log("JSON.parse_ERROR：" + text);
                return null;
            }

            var result = null;
            try{
                result = JsonParse(text);
            } catch (err) {
                console.log("JSON.parse_ERROR：" + text);
            }
            return result;
        }
    }

    public static parse(text, testFlag){
        if(!text){
            console.log("JSON.parse_ERROR：" + testFlag + " --- " + text);
            return null;
        }
        var result = null;
        try{
            result = JSON.parse(text);
        } catch (err) {
            console.log("JSON.parse_ERROR：" + testFlag + " --- " + text);
        }
        return result;
    }
}