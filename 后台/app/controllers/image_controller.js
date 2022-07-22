/*
 * @Author: yinxl 
 * @Date: 2019-11-20 13:41:58 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-21 12:34:08
 */
const fs = require('fs');
const path = require("path");
const uuidv1 = require('uuid/v1');
const Image_col = require('./../models/images');

const add = async (ctx, next) => {
    const req = ctx.request.body;
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let imageId = uuidv1();
    let fileFormat = (file.name).split(".");
    let filePath = path.join(__dirname, '../../images/') + imageId + "." + fileFormat[fileFormat.length - 1];
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    const result = await Image_col.create({
        imageId: imageId,
        imageName: fileFormat.splice(0,fileFormat.length - 1).join(""),
        systemId: req.systemId,
        ext: fileFormat[fileFormat.length - 1]
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '上传成功',
        data: result
    }
};

const list = async (ctx, next) => {
    const req = ctx.request.body;
    let seachConfig = {};
    if (req.systemId) {
        seachConfig.systemId = req.systemId
    }
    if (req.tag) {
        seachConfig.tag = req.tag
    }
    let result = await Image_col.aggregate([{
        $match: seachConfig
    }]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    }
};
module.exports = {
    add,
    list
}