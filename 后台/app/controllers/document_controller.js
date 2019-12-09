/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-09 17:16:59
 */

const fs = require('fs');
const Document_col = require('./../models/document');
const Template_col = require('./../models/template');
const uuidv1 = require('uuid/v1');

const addDocument= async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const arr = req.time.split('-');
    req.year = arr[0];
    req.month = arr[1];
    if (req.documentId=='') { //新增
        req.documentId = uuidv1();
        await Document_col.create(req);
    } else {
        await Document_col.updateOne({
            documentId: req.documentId
        },req);
    }
    fs.writeFile('data/markdown/' + req.documentName + '.md', req.content, function (err) {
    })
    let newdocument = await Document_col.find({documentId: req.documentId});
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: newdocument
    }
}

const seachDocument = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.query;
    let documentList = await Document_col.find({
        'userId': req.userId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: documentList
    }
}

const commitDocument = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Document_col.updateMany({
        'userId': req.userId,
        'documentId': req.documentId
    },{
        status: true
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const resetDocument = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.params;
    await Document_col.updateMany({
        'documentId': req.id
    },{
        status: false
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const getDetails = async (ctx) => {
    const id = ctx.params.id;
    const document = await Document_col.findOne({
        'documentId': id
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: document
    }
}

const delDocument = async (ctx) => {
    ctx.status = 200;
    const id = ctx.params.id;
    await Document_col.remove({
        'documentId': id
    })
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const allDocument = async (ctx) => {
    ctx.status = 200;
    const req = ctx.query;
    if (!!req.time) {
        const arr = req.time.split('-');
        var documentList = await Document_col.find({
            year: arr[0],
            month: arr[1],
            status: true
        });
    } else {
        var documentList = await Document_col.find({
            status: true
        });
    }
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: documentList
    }
}

const addTemplate = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const arr = req.time.split('-');
    req.year = arr[0];
    req.month = arr[1];
    if (req.templateId!='') { //删除原有数据
        await Template_col.deleteMany({
            templateId: req.templateId
        });
    }
    req.templateId = uuidv1();
    await Template_col.create(req);
    let newTemplate = await Template_col.find({templateId: req.templateId});
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: newTemplate
    }
}

const seachTemplate = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.query;
    let templateList = await Template_col.find({
        'userId': req.userId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: templateList
    }
}

const getTemplateDetails = async (ctx,next) => {
    const id = ctx.params.id;
    const template = await Template_col.findOne({
        'templateId': id
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: template
    }
}

const delTemplate = async (ctx) => {
    ctx.status = 200;
    const id = ctx.params.id;
    await Template_col.remove({
        'templateId': id
    })
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const commitTemplate = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Template_col.updateMany({
        'userId': req.userId,
        'templateId': req.templateId
    },{
        status: true
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

module.exports = {
    addDocument,
    seachDocument,
    commitDocument,
    getDetails,
    delDocument,
    allDocument,
    resetDocument,
    addTemplate,
    seachTemplate,
    getTemplateDetails,
    delTemplate,
    commitTemplate
}