/*
 * @Author: yinxl 
 * @Date: 2019-11-20 09:27:16 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-08 10:22:07
 */
const fs = require('fs');
const send = require('koa-send');
const toChinesNum = require('./../utils/formatNum');
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
        root: './data/document'
    });
}

const downloadDocument = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    fs.writeFile('data/document/' + req.doctitle + '.md', writeTemplate(req), function (err) {})
    ctx.body = {
        code: 1,
        msg: '生成成功'
    }
}

const writeTemplate = (data) => {
    let text = '# ' + data.doctitle;
    for(let i = 0; i <data.list.length; i++) { //本月总结
        text += '\n';
        text += '## ' + toChinesNum(i+1) +'、' + data.list[i].systemName;
        for(let j = 0; j <data.list[i].content.length; j++) {
            text += '\n';
            text += '- **' + (j+1) + '、' + data.list[i].content[j].contentTitle + '：**' + data.list[i].content[j].contentDescription;
        }
    }
    return text;
}

module.exports = {
    downloadAll,
    downloadMarkdown,
    downloadDocument
}