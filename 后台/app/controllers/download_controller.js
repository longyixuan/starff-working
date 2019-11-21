/*
 * @Author: yinxl 
 * @Date: 2019-11-20 09:27:16 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-11-20 09:51:31
 */
const send = require('koa-send');

const downloadAll = async (ctx) => {
    const fileName = '工时系统数据备份.zip';
    ctx.attachment(fileName);
    await send(ctx, fileName, {
        root: './data'
    });
};

module.exports = {
    downloadAll
}