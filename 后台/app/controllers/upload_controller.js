/*
 * @Author: yinxl 
 * @Date: 2019-11-20 13:41:58 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-11-22 11:34:38
 */
const fs = require('fs');
const unzip = require("unzip");
const path = require("path");

const WorkTime_col = require('./../models/workTime');
const System_col = require('./../models/system');
const User_col = require('./../models/user');
const Role_col = require('./../models/role');
const Menu_col = require('./../models/menu');
const Department_col = require('./../models/department');
const Passport_col = require('./../models/password');

const upload = async (ctx, next) => {
    const file = ctx.request.files.file;
    // const filename = file.name;
    const targetPath = 'uploads';
    // fs.createReadStream(file.path).pipe(fs.createWriteStream(targetPath));
    const extract = unzip.Extract({
        path: targetPath
    });
    extract.on('finish', function () {
        console.log("解压完成!!");
    });
    extract.on('error', function (err) {
        console.log(err);
    });
    fs.createReadStream(file.path).pipe(extract);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '上传成功'
    }
};

const installTime = async (ctx) => {
    fileDisplay('uploads/');
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '导入成功'
    }
}
const fileDisplay = (filePath) => {
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            if (files.length>0) {
                removeData(function(){
                    files.forEach(function (filename) {
                        //获取当前文件的绝对路径
                        let filedir = path.join(filePath, filename);
                        //根据文件路径获取文件信息，返回一个fs.Stats对象
                        fs.stat(filedir, function (eror, stats) {
                            if (eror) {
                                console.warn('获取文件stats失败');
                            } else {
                                let isFile = stats.isFile(); //是文件
                                let isDir = stats.isDirectory(); //是文件夹
                                if (isFile) {
                                    // 读取文件内容
                                    let content = fs.readFileSync(filedir, 'utf-8');
                                    // console.log(content);
                                    insertData(filename,JSON.parse(content))
                                }
                                if (isDir) {
                                    //删除原有数据
                                    fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                                }
                            }
                        })
                    });
                });
            }
        }
    })
}

const insertData = async (name, data) => {
    switch (name) {
        case 'worktime.json':
            console.log('worktime数据开始插入');
            await WorkTime_col.insertMany(data);
            console.log('插入worktime数据成功');
            break;
        case 'system.json':
            console.log('system数据开始插入');
            await System_col.insertMany(data);
            console.log('插入system数据成功');
            break;
        case 'user.json':
            console.log('user数据开始插入');
            await User_col.insertMany(data);
            console.log('插入user数据成功');
            break;
        case 'role.json':
            console.log('role数据开始插入');
            await Role_col.insertMany(data);
            console.log('插入role数据成功');
            break;
        case 'menu.json':
            console.log('menu数据开始插入');
            await Menu_col.insertMany(data);
            console.log('插入menu数据成功');
            break;
        case 'department.json':
            console.log('department数据开始插入');
            await Department_col.insertMany(data);
            console.log('插入department数据成功');
            break;
        case 'passport.json':
            console.log('passport数据开始插入');
            await Passport_col.insertMany(data);
            console.log('插入passport数据成功');
            break;
    }
}

const removeData = async (callback) => {
    console.log('开始清空数据')
    await WorkTime_col.deleteMany();
    console.log('开始清空数据WorkTime_col')
    await System_col.deleteMany();
    console.log('开始清空数据System_col')
    await User_col.deleteMany();
    console.log('开始清空数据User_col')
    await Role_col.deleteMany();
    console.log('开始清空数据Role_col')
    await Menu_col.deleteMany();
    console.log('开始清空数据Menu_col')
    await Department_col.deleteMany();
    console.log('开始清空数据Department_col')
    await Passport_col.deleteMany();
    console.log('开始清空数据Passport_col')
    console.log('数据清空完毕');
    callback();
}
module.exports = {
    upload,
    installTime
}