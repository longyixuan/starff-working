/*
 * @Author: yinxl 
 * @Date: 2019-11-20 09:27:16 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-11 10:49:36
 */
const send = require('koa-send');

const downloadAll = async (ctx) => {
    const fileName = 'worktimeCopy.zip';
    ctx.attachment(fileName);
    await send(ctx, fileName, {
        root: './data'
    });
};

const downloadMarkdown = async (ctx, next) => {
    const fileName = ctx.query.fileName + '.md';
    ctx.attachment(fileName);
    await send(ctx, fileName, {
        root: './data/template'
    });
}

// const downloadTemplate = async (ctx, next) => {
//     const fileName = ctx.query.fileName + '.md';
//     ctx.attachment(fileName);
//     await send(ctx, fileName, {
//         root: './data/template'
//     });
// }

module.exports = {
    downloadAll,
    downloadMarkdown
    // downloadTemplate
}