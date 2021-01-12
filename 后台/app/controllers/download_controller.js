/*
 * @Author: yinxl 
 * @Date: 2019-11-20 09:27:16 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-12 17:18:03
 */
const fs = require('fs');
const send = require('koa-send');
const toChinesNum = require('./../utils/formatNum');
const Model_col = require('./../models/model');
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

const seachModel = (list,value) => {
    var str = '';
    for (let i = 0; i < list.length; i++) {
        if (list[i].modelId == value) {
            str = list[i].modelName;
        }
    }
    return str;
}

const downloadDocument = async (ctx, next) => {
    console.log(ctx)
    ctx.status = 200;
    const req = ctx.request.body;
    let text = '# ' + req.doctitle;
    const data = JSON.parse(req.list)
    const gzjh = JSON.parse(req.gzjh)
    const ModelResult = await Model_col.find();
    for(let i = 0; i <data.length; i++) { //本月总结
        text += '\n';
        text += '## ' + toChinesNum(i+1) +'、' + data[i].systemName;
        for(let j = 0; j <data[i].content.length; j++) {
            text += '\n';
            text += '- **' + (j+1) + '、' + seachModel(ModelResult,data[i].content[j].contentTitle) + '：**' + data[i].content[j].contentDescription;
        }
    }
    text += '\n';
    text += '## 工作计划';
    for (let i = 0; i < gzjh.length; i++) { //下月总结
        text += '\n';
        text += '- '+gzjh[i].gzjh;
    }
    fs.writeFile('data/document/' + req.doctitle + '.md', text, function (err) {})
    ctx.body = {
        code: 1,
        msg: '生成成功'
    }
}

module.exports = {
    downloadAll,
    downloadMarkdown,
    downloadDocument
}