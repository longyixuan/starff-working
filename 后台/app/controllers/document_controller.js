/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-04 22:30:48
 */

const Document_col = require('./../models/document');
const uuidv1 = require('uuid/v1');

const addDocument= async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    if (req.documentId=='') { //新增
        req.documentId = uuidv1();
        await Document_col.create(req);
    } else {
        await Department_col.updateOne({
            documentId: req.parentId
        },req);
    }
    let newdocument = await Document_col.find({documentId: req.documentId});
    console.log(newdocument)
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

module.exports = {
    addDocument,
    seachDocument,
    commitDocument,
    getDetails,
    delDocument
}