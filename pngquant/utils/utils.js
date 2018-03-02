var path = require("path");
var fs = require("fs");
var child_process = require("child_process");

var res_path = null;
var list = [];
var process_limit = 4;

class utils {

    static checkIsExistPngquant( target){
        let proj_path = Editor.projectInfo.path;

        
    }

    static checkIsExistProject( target){
        let proj_path = Editor.projectPath;
        res_path = null;

        if(target == "web-mobile"){
            proj_path = `${path.sep}build${path.sep}web-mobile`;
            res_path = `${Editor.projectInfo.path}${proj_path}${path.sep}res`
        }else if(target == "native-default"){
            //proj_path = Editor.projectPath + "build/webmobile"
        }else if(target == "native-binary"){

        }else if(target == "native-binary"){

        }else{
            return false;
        }

        Editor.log(`正在检测构建工程是否存在：${Editor.projectInfo.path}${proj_path}`);
        try{
            let state = fs.lstatSync(`${ Editor.projectInfo.path }${ proj_path }`);
            Editor.log(state.isDirectory());
            Editor.log(res_path);
            return state.isDirectory();
        }catch(error){
            Editor.error("构建工程不存在!请先构建项目...");
            return false;
        }   
        
    }

    static loadPngFiles(){
        if(!res_path) return;
        list = [];
        let state = fs.lstatSync(res_path);
        if(state.isDirectory()){
            utils.scanFiles(res_path);
        }
        return list;
    }

    static scanFiles(dir){
        
        let files = fs.readdirSync(dir);
        
        for(let i = 0; i < files.length; i++){
            let file = files[i];
            let file_path = path.join(dir, file);
            let stat = fs.lstatSync(file_path);
            if(stat.isDirectory()){
                utils.scanFiles(file_path);
            }else{
                if(utils.isPng(file_path)){
                    let item = {
                        path: file_path,
                        before_size: stat.size,
                        name: file,
                    }
                    list.push(item);
                }
            }
        }
    }

    static isPng(fileName){
        if (path.extname(fileName).toLocaleLowerCase() == ".png") {
            return true
        } else {
            return false
        }
    }

    static compressionPng(){
        Editor.success("pngquant start!")

        let index= 0;

        let pngquant_path = Editor.url('packages://pngquant/tool/windows/pngquant.exe');
        let cmd = pngquant_path + " --transbug --force 256 --ext .png";
       
        let item = list[index];
        let exe_cmd = cmd + ' ' + item.path;
        Editor.log("pngquant : " + item.path);
        
        function exec(){
            child_process.exec(exe_cmd, { timeout: 3654321 }, function (error, stdout, stderr){
                if(stderr){
                    Editor.error("pngquant error : " + stderr);
                    //return;
                }
                if(index < list.length - 1){
                    index++;
                    item = list[index];
                    exe_cmd = cmd + ' ' + item.path;
                    exec();
                    Editor.log("pngquant : " + item.path);
                }else{
                    Editor.success("pngquant finished!");
                }
                
            })
        }
        exec();
    }
}

module.exports = utils