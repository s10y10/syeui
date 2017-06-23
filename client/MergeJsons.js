/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 13-12-2
 * Time: PM11:55
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var read_project_dir = path.join(__dirname);
if (process.argv[2]) {
    read_project_dir = process.argv[2];
}

var readFile = function(fileName)
{
    var fileData = fs.readFileSync(fileName, "utf-8");
    return fileData;
};

var saveFile = function (fileName, json)
{
    fs.writeFile(fileName, JSON.stringify(json, null, ""), function (err) {
        if (err) throw err;
    });
};

console.log("----------------------:"+path.join(read_project_dir, "merge_resource.json"))
//读取 合并的配置文件
var fileStr = readFile(path.join(read_project_dir, "merge_resource.json"));

var bigJson = JSON.parse(fileStr);
var fileJson = {};
for (var r in bigJson["resources"]) {
    fileJson[bigJson["resources"][r]["name"]] = bigJson["resources"][r];
}

var groupJson = bigJson["groups"];

for (var key in groupJson) {
    var group = groupJson[key];

    var saveDir = path.join(read_project_dir, "resource", group["name"]);
    var json = {};
    var subkeys = group["keys"];
    if (subkeys != "") {
        var keysArr = subkeys.split(",");
        for (var i = 0; i < keysArr.length; i++) {
            var subkey = keysArr[i];

            var info = fileJson[subkey];
            var simpleFileStr = readFile(path.join(read_project_dir, "resource", info["url"]));
            var content;
            if (info["type"] == "json") {//json
                try {
                    content = JSON.parse(simpleFileStr);
                } catch(e) {
                    console.log(e,info["name"]);
                }
            }
            else{
                content = simpleFileStr;
            }

            if (info["type"] == "font") {
                json[info["name"]] = {"u" : info["url"], "t" : info["type"], "d" : content};
            }
            else {
                json[info["name"]] = {"t" : info["type"], "d" : content};
            }
        }
    }

    saveFile(saveDir, json);
    console.log(group["name"] + ' merge success!');
}

function clearNullValue(){
    var clear = exec("json-optimizer "+read_project_dir+"/resource/config/config.json");
    clear.on('exit',function(code){
        if(code == 0)
        {
            console.log("已清理掉0值和空值");
        }
        else
        {
            console.log("清0值异常,请检查是否安装了json-optimizer");
        }
    })
}

clearNullValue();
