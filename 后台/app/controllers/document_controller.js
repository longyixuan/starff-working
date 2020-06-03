/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-03 16:14:31
 */

const fs = require('fs');
const Document_col = require('./../models/document');
const Modal_col = require('./../models/modal');
const Template_col = require('./../models/template');
const Documentday_col = require('./../models/documentDay');
const toChinesNum = require('./../utils/formatNum')
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
    await Documentday_col.updateMany({
        'documentId': req.documentId
    },{
        status: req.status
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
    await Document_col.deleteOne({
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
    fs.writeFile('data/template/' + req.templateName + '.md', writeTemplate(req), function (err) {
    })
    let newTemplate = await Template_col.find({templateId: req.templateId});
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: newTemplate
    }
}
const writeTemplate = (data) => {
    let text = '# ' + data.templateName;
    for(let i = 0; i <data.templateList.length; i++) { //本月总结
        text += '\n';
        text += '## ' + toChinesNum(i+1) +'、' + data.templateList[i].systemName;
        for(let j = 0; j <data.templateList[i].content.length; j++) {
            text += '\n';
            text += '- **' + (j+1) + '、' + data.templateList[i].content[j].contentTitle + '：**' + data.templateList[i].content[j].contentDescription
        }
    }
    text += '\n';
    text += '## 附：下月工作计划';
    for(let m = 0; m <data.templateList.length; m++) { //下月计划
        text += '\n';
        text += '### ' + data.templateList[m].systemName;
        for(let n = 0; n <data.templateList[m].content.length; n++) {
            text += '\n';
            text += '- **' + data.templateList[m].content[n].contentTitle + '：' + data.templateList[m].content[n].contentDescription + '**'
        }
    }
    return text;
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
    await Template_col.deleteOne({
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

const mergeTemplate = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.request.body.mergeList;
    let result = {
        month: req[0].month,
        year: req[0].year,
        templateList: [],
        templateList2: []
    };
    req.forEach(item => {
        result.templateList = [...result.templateList,...item.templateList]
        result.templateList2 = [...result.templateList2,...item.templateList2]
    })
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    }
}

const resetTemplate = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.params;
    await Template_col.updateMany({
        'templateId': req.id
    },{
        status: false
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const allTemplate = async (ctx) => {
    ctx.status = 200;
    const req = ctx.query;
    if (!!req.time) {
        const arr = req.time.split('-');
        var templateList = await Template_col.find({
            year: arr[0],
            month: arr[1],
            status: true
        });
    } else {
        var templateList = await Template_col.find({
            status: true
        });
    }
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: templateList
    }
}

const addDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const document = await Documentday_col.findOne({
        documentName: req.summaryName,
    });
    const documentId = uuidv1();
    if (document) {
        ctx.body = {
            code: 0,
            msg: '本日已有记录，请勿重新添加！'
        }
        return;
    }
    for (let i = 0; i < req.list.length; i++) {
        let modal = await Modal_col.findOne({
            systemId: req.list[i].systemId,
            modalName: req.list[i].contentTitle
        });
        if (modal) {
            console.log('已有标签')
        } else {
            await Modal_col.create({
                systemId: req.list[i].systemId,
                modalName: req.list[i].contentTitle
            })
        }
        req.list[i].documentId = documentId;
        req.list[i].timeDate = new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day);
    }
    await Documentday_col.insertMany(req.list);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: req.list
    }
}

const editDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    if (req.documentId!='') { //删除原有数据
        await Documentday_col.deleteMany({
            documentName: req.summaryName
        });
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        let modal = await Modal_col.findOne({
            systemId: req.list[i].systemId,
            modalName: req.list[i].contentTitle
        });
        if (modal) {
            console.log('已有标签');
        } else {
            await Modal_col.create({
                systemId: req.list[i].systemId,
                modalName: req.list[i].contentTitle
            })
        }
        req.list[i].documentId = documentId;
        req.list[i].timeDate = new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day);
    }
    await Documentday_col.insertMany(req.list);
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const delteDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Documentday_col.deleteMany({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const detailsDocumentday = async (ctx) => {
    const id = ctx.query.id;
    const document = await Documentday_col.aggregate([
        {
            $match: {
                'documentId': id
            }
        },
        {
            $sort: {
                'order': -1
            }
        },
        {
            $group: {
                _id: {
                    systemId: '$systemId',
                    systemName: '$systemName',
                    order: '$order',
                    time: '$time'
                },
                order: {
                    $min: '$order'
                },  
                content: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        month: '$month',
                        day: '$day',
                        systemId: '$systemId',
                        order: '$order',
                        systemName: '$systemName',
                        contentTitle: '$contentTitle',
                        contentDescription: '$contentDescription'
                    }
                }
            }
        }
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: document
    }
}

const mergeDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentday_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $sort: {
                'day': 1
            }
        },
        {
            $group: {
                _id: {
                    systemId: '$systemId',
                    systemName: '$systemName',
                },
                details: {
                    $push: {
                        year: '$year',
                        month: '$month',
                        day: '$day',
                        nickName: '$nickName',
                        contentTitle: '$contentTitle',
                        contentDescription: '$contentDescription'
                    }
                }
            }
        }
    ])
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
    }
}

const seachModal = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.query;
    let list = [];
    if (req.id!='') {
        list = await Modal_col.find({
            systemId: req.id
        });
    } else {
        list = await Modal_col.find();
    }
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
    }
}
const addModal = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let modal = await Modal_col.findOne(req);
    if (modal) {
        console.log('已有标签')
    } else {
        await Modal_col.create(req);
    }
    const list = await Modal_col.find({
        systemId: req.systemId
    })
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
    }
}

const seachDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentday_col.aggregate([
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'status': true,
                'timeDate': {
                    $gte: new Date(req.startTime),
                    $lte: new Date(req.endTime)
                }
            }
        },
        {
            $sort: {
                'day': -1
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId'
                },
                details: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        month: '$month',
                        day: '$day',
                        status: '$status',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        contentTitle: '$contentTitle',
                        contentDescription: '$contentDescription'
                    }
                }
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
    }
}
const listDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.query;
    const list = await Documentday_col.aggregate([
        {
            $match: {
                'userId': req.userId,
                'year': req.year,
                'month': req.month
            }
        },
        {
            $sort: {
                'day': -1
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId'
                },
                details: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        month: '$month',
                        day: '$day',
                        status: '$status',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        contentTitle: '$contentTitle',
                        contentDescription: '$contentDescription'
                    }
                }
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
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
    commitTemplate,
    allTemplate,
    resetTemplate,
    mergeTemplate,
    addDocumentday,
    editDocumentday,
    delteDocumentday,
    detailsDocumentday,
    listDocumentday,
    mergeDocumentday,
    seachDocumentday,
    seachModal,
    addModal
}