/*
 * @Author: yinxl 
 * @Date: 2019-11-20 13:41:58 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-10 12:21:46
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
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '上传成功',
        data: imageId
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