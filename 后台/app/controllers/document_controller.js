/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-25 14:06:16
 */

const fs = require('fs');
const Document_col = require('./../models/document');
const Modal_col = require('./../models/modal');
const System_col = require('./../models/system');
const Template_col = require('./../models/template');
const Documentday_col = require('./../models/documentDay');
const Documentweek_col = require('./../models/documentWeek');
const Documentmonth_col = require('./../models/documentMonth');
const Documentnext_col = require('./../models/documentNext');
const Callback_col = require('./../models/callback');
const WorkTime_col = require('./../models/workTime');
const Status_col = require('./../models/status');
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
    let result = await Status_col.findOne({
        'documentId': req.documentId
    });
    
    if (req.status=='true') { //提交
        if (result) { //提交修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '1'
            });
        }
    } else { //退回
        if(result) {//标记退回，修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '0'
            });
        } else { //标记退回，增加状态
            await Status_col.create({
                'documentId': req.documentId,
                'status': '0',
                'type': 'day'
            });
        }
    }
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
        req.list[i].documentId = documentId;
        req.list[i].timeDate = new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day);
        if (req.list[i].time) {
            let time = await WorkTime_col.findOne({
                'systemId': req.list[i].systemId,
                'userId': req.list[i].userId,
                'year': parseInt(req.list[i].year),
                'month': parseInt(req.list[i].month),
                'day': parseInt(req.list[i].day)
            });
            if (time) { //更新
                await WorkTime_col.updateOne({
                    'systemId': req.list[i].systemId,
                    'userId': req.list[i].userId,
                    'year': parseInt(req.list[i].year),
                    'month': parseInt(req.list[i].month),
                    'day': parseInt(req.list[i].day)
                }, {
                    time: parseFloat(req.list[i].time)
                });
            } else { //新增加
                await WorkTime_col.create({
                    systemId: req.list[i].systemId,
                    systemName: req.list[i].systemName,
                    userId: req.list[i].userId,
                    userName: req.list[i].userName,
                    year: parseInt(req.list[i].year),
                    month: parseInt(req.list[i].month),
                    day: parseInt(req.list[i].day),
                    time: parseFloat(req.list[i].time),
                    id: uuidv1(),
                    timeDate: new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day)
                });
            }
        }
    }
    await Documentday_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
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
        await Documentnext_col.deleteMany({
            documentId: req.documentId
        });
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        req.list[i].documentId = documentId;
        req.list[i].timeDate = new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day);
        if (req.list[i].time) {
            let time = await WorkTime_col.findOne({
                'systemId': req.list[i].systemId,
                'userId': req.list[i].userId,
                'year': parseInt(req.list[i].year),
                'month': parseInt(req.list[i].month),
                'day': parseInt(req.list[i].day)
            });
            if (time) { //更新
                await WorkTime_col.updateOne({
                    'systemId': req.list[i].systemId,
                    'userId': req.list[i].userId,
                    'year': parseInt(req.list[i].year),
                    'month': parseInt(req.list[i].month),
                    'day': parseInt(req.list[i].day)
                }, {
                    time: parseFloat(req.list[i].time)
                });
            } else { //新增加
                await WorkTime_col.create({
                    systemId: req.list[i].systemId,
                    systemName: req.list[i].systemName,
                    userId: req.list[i].userId,
                    userName: req.list[i].userName,
                    year: parseInt(req.list[i].year),
                    month: parseInt(req.list[i].month),
                    day: parseInt(req.list[i].day),
                    time: parseFloat(req.list[i].time),
                    id: uuidv1(),
                    timeDate: new Date(req.list[i].year + '-' + req.list[i].month + '-' + req.list[i].day)
                });
            }
        }
    }
    await Documentday_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
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
    await Documentnext_col.deleteMany({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const detailsDocumentday = async (ctx) => {
    const id = ctx.query.id;
    const gzjh = await Documentnext_col.find({
        'documentId': id
    });
    const thyy = await Callback_col.findOne({
        'documentId': id
    });
    const document = await Documentday_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
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
                    time: '$time',
                    status_info: '$status_info'
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
        data: document,
        gzjh: gzjh,
        thyy: thyy
    }
}

const mergeDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.mergeList = JSON.parse(req.mergeList);
    const reg = new RegExp(req.keyword, 'i');
    const gzjh = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { userId: '$userId', userName: '$userName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
        
    ])
    const gzjh2 = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { systemId: '$systemId', systemName: '$systemName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
        
    ])
    const list = await Documentday_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                },
                $or: [
                    {'contentTitle': {$regex : reg}},
                    {'contentDescription': {$regex : reg}}
                ]
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
                    systemName: '$systemName'
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
        data: list,
        gzjh: gzjh,
        gzjh2: gzjh2
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
    await System_col.updateMany({
        id: req.systemId
    },{
        $set:{
            modal: req.modalList
        }
    })
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const seachDocumentday = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentday_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
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
                    documentId: '$documentId',
                    status_info: '$status_info'
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
    let prelist = [];
    const list = await Documentday_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
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
                    documentId: '$documentId',
                    year: '$year',
                    month: '$month',
                    day: '$day',
                    status_info: '$status_info',
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
    if (req.premonth!='') {
        prelist = await Documentday_col.aggregate([
            {
                $lookup: {
                    from: "status",
                    localField: "documentId",
                    foreignField: "documentId",
                    as: "status_info"
                }
            },
            {
                $match: {
                    'userId': req.userId,
                    'year': req.year,
                    'month': req.premonth
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
                        documentId: '$documentId',
                        year: '$year',
                        month: '$month',
                        day: '$day',
                        status_info: '$status_info',
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
    }
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list,
        prelist: prelist
    }
}

const toDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentday_col.aggregate([
        {
            $match: {
                'userId': req.userId,
                'documentId': {
                    '$in': req.list
                }
            }
        },
        {
            $group: {
                _id :  {
                    systemId: '$systemId',
                    systemName: '$systemName',
                    contentTitle: '$contentTitle'
                },
                details: {
                    $push: '$contentDescription'
                }
            }
        },
        {
            $project: {
                _id: 0,
                systemId: '$_id.systemId',
                systemName: '$_id.systemName',
                contentTitle: '$_id.contentTitle',
                details: '$details'
            }
        }
    ]);
    let insertList = [];
    const documentId = uuidv1();
    for (let i = 0; i <list.length; i++) {
        insertList.push({
            documentId: documentId,
            documentName: req.documentName,
            userId: req.userId,
            userName: req.userName,
            nickName: req.nickName,
            year: req.year,
            startDay: new Date(req.startDay),
            endDay: new Date(req.endDay),
            systemId: list[i].systemId,
            systemName: list[i].systemName,
            contentTitle: list[i].contentTitle,
            contentDescription: list[i].details.join('\n')
        })
    }
    await Documentweek_col.insertMany(insertList);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: list
    }
}

const listDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.query;
    const list = await Documentweek_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
        {
            $match: {
                'userId': req.userId,
                'year': req.year
            }
        },
        {
            $sort: {
                'startDay': -1,
                'endDay': -1
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId',
                    year: '$year',
                    startDay: '$startDay',
                    endDay: '$endDay',
                    status_info: '$status_info'
                },
                details: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        startDay: '$startDay',
                        endDay: '$endDay',
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
const addDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.list = JSON.parse(req.list);
    const document = await Documentweek_col.findOne({
        documentName: req.summaryName,
    });
    if (document) {
        ctx.body = {
            code: 0,
            msg: '本周已有记录，请勿重新添加！'
        }
        return;
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        req.list[i].documentId = documentId;
    }
    await Documentweek_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: req.list
    }
}
const editDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.list = JSON.parse(req.list);
    if (req.documentId!='') { //删除原有数据
        await Documentweek_col.deleteMany({
            documentName: req.summaryName
        });
        await Documentnext_col.deleteMany({
            documentId: req.documentId
        });
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        req.list[i].documentId = documentId;
    }
    await Documentweek_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const detailsDocumentweek = async (ctx) => {
    const id = ctx.query.id;
    const gzjh = await Documentnext_col.find({
        'documentId': id
    });
    const thyy = await Callback_col.findOne({
        'documentId': id
    });
    const document = await Documentweek_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
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
                    status_info: '$status_info'
                },
                content: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        startDay: '$startDay',
                        endDay: '$endDay',
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
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: document,
        gzjh: gzjh,
        thyy: thyy
    }
}

const commitDocumentWeek = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Documentweek_col.updateMany({
        'documentId': req.documentId
    },{
        status: req.status
    });
    let result = await Status_col.findOne({
        'documentId': req.documentId
    });
    
    if (req.status=='true') { //提交
        if (result) { //提交修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '1'
            });
        }
    } else { //退回
        if(result) {//标记退回，修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '0'
            });
        } else { //标记退回，增加状态
            await Status_col.create({
                'documentId': req.documentId,
                'status': '0',
                'type': 'week'
            });
        }
    }
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const delteDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Documentweek_col.deleteMany({
        documentId: req.documentId
    });
    await Documentnext_col.deleteMany({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const seachDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentweek_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'startDay': {
                    $gte: new Date(req.startTime)
                },
                'endDay': {
                    $lte: new Date(req.endTime)
                }
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId',
                    status_info: '$status_info'
                },
                details: {
                    $push: {
                        documentId: '$documentId',
                        documentName: '$documentName',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: '$nickName',
                        year: '$year',
                        startDay: '$startDay',
                        endDay: '$endDay',
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

const mergeDocumentweek = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.mergeList = JSON.parse(req.mergeList);
    const reg = new RegExp(req.keyword, 'i');
    const gzjh2 = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { systemId: '$systemId', systemName: '$systemName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
    ])
    const gzjh = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { userId: '$userId', userName: '$userName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
    ])
    const list = await Documentweek_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                },
                $or: [
                    {'contentTitle': {$regex : reg}},
                    {'contentDescription': {$regex : reg}}
                ]
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
                        nickName: '$nickName',
                        startDay: '$startDay',
                        endDay: '$endDay',
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
        data: list,
        gzjh: gzjh,
        gzjh2: gzjh2
    }
}

const toDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentweek_col.aggregate([
        {
            $match: {
                'userId': req.userId,
                'documentId': {
                    '$in': req.list
                }
            }
        },
        {
            $group: {
                _id :  {
                    systemId: '$systemId',
                    systemName: '$systemName',
                    contentTitle: '$contentTitle'
                },
                details: {
                    $push: '$contentDescription'
                }
            }
        },
        {
            $project: {
                _id: 0,
                systemId: '$_id.systemId',
                systemName: '$_id.systemName',
                contentTitle: '$_id.contentTitle',
                details: '$details'
            }
        }
    ]);
    let insertList = [];
    const documentId = uuidv1();
    for (let i = 0; i <list.length; i++) {
        insertList.push({
            documentId: documentId,
            documentName: req.documentName,
            userId: req.userId,
            userName: req.userName,
            nickName: req.nickName,
            year: req.year,
            month: req.month,
            systemId: list[i].systemId,
            systemName: list[i].systemName,
            contentTitle: list[i].contentTitle,
            contentDescription: list[i].details.join('\n')
        })
    }
    await Documentmonth_col.insertMany(insertList);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: insertList
    }
}

const listDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.query;
    const list = await Documentmonth_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
        {
            $match: {
                'userId': req.userId,
                'year': req.year
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId',
                    year: '$year',
                    month: '$month',
                    status_info: '$status_info'
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
const addDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.list = JSON.parse(req.list);
    const document = await Documentmonth_col.findOne({
        documentName: req.summaryName,
    });
    if (document) {
        ctx.body = {
            code: 0,
            msg: '本月已有记录，请勿重新添加！'
        }
        return;
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        req.list[i].documentId = documentId;
    }
    await Documentmonth_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: req.list
    }
}
const editDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.list = JSON.parse(req.list);
    if (req.documentId!='') { //删除原有数据
        await Documentmonth_col.deleteMany({
            documentName: req.summaryName
        });
        await Documentnext_col.deleteMany({
            documentId: req.documentId
        });
    }
    const documentId = uuidv1();
    for (let i = 0; i < req.list.length; i++) {
        req.list[i].documentId = documentId;
    }
    await Documentmonth_col.insertMany(req.list);
    var gzjh = [];
    req.gzjh.forEach(item=> {
        gzjh.push({
            documentId: documentId,
            gzjh: item.gzjh,
            systemId: item.systemId,
            systemName: item.systemName,
            userId: req.list[0].userId,
            userName: req.list[0].userName,
            nickName: req.list[0].nickName
        });
    });
    await Documentnext_col.insertMany(gzjh)
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const detailsDocumentmonth = async (ctx) => {
    const id = ctx.query.id;
    const gzjh = await Documentnext_col.find({
        'documentId': id
    });
    const thyy = await Callback_col.findOne({
        'documentId': id
    });
    const document = await Documentmonth_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
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
                    status_info: '$status_info'
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
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: document,
        gzjh: gzjh,
        thyy: thyy
    }
}

const commitDocumentMonth = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Documentmonth_col.updateMany({
        'documentId': req.documentId
    },{
        status: req.status
    });
    let result = await Status_col.findOne({
        'documentId': req.documentId
    });
    
    if (req.status=='true') { //提交
        if (result) { //提交修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '1'
            });
        }
    } else { //退回
        if(result) {//标记退回，修改状态
            await Status_col.updateMany({
                'documentId': req.documentId
            },{
                status: '0'
            });
        } else { //标记退回，增加状态
            await Status_col.create({
                'documentId': req.documentId,
                'status': '0',
                'type': 'month'
            });
        }
    }
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const delteDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Documentmonth_col.deleteMany({
        documentId: req.documentId
    });
    await Documentnext_col.deleteMany({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}

const seachDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const list = await Documentmonth_col.aggregate([
        {
            $lookup: {
                from: "status",
                localField: "documentId",
                foreignField: "documentId",
                as: "status_info"
            }
        },
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'year': req.year,
                'month': req.month
            }
        },
        {
            $group: {
                _id: {
                    documentName: '$documentName',
                    documentId: '$documentId',
                    status_info: '$status_info'
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

const mergeDocumentmonth = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.mergeList = JSON.parse(req.mergeList);
    const reg = new RegExp(req.keyword, 'i');
    const gzjh2 = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { systemId: '$systemId', systemName: '$systemName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
    ])
    const gzjh = await Documentnext_col.aggregate([
        {
            $match: {
                'documentId': {
                    '$in': req.mergeList
                }
            }
        },
        {
            $group: {
                _id : { userId: '$userId', userName: '$userName'},
                details: {
                    $push: {
                        documentId: '$documentId',
                        gzjh: '$gzjh',
                        nickName: '$nickName',
                        systemId: '$systemId',
                        systemName: '$systemName',
                        userId: '$userId',
                        userName: '$userName'
                    }
                }
            }
        }
    ])
    const list = await Documentmonth_col.aggregate([{
            $match: {
                'documentId': {
                    '$in': req.mergeList
                },
                $or: [
                    {'contentTitle': {$regex : reg}},
                    {'contentDescription': {$regex : reg}}
                ]
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
                        nickName: '$nickName',
                        startDay: '$startDay',
                        endDay: '$endDay',
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
        data: list,
        gzjh: gzjh,
        gzjh2: gzjh2
    }
}

const callbackDocument = async (ctx) => { //
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Callback_col.findOne({
        documentId: req.documentId
    });
    if (!result) { //新加
        await Callback_col.create({
            documentId: req.documentId,
            userId: req.userId,
            commentId: req.commentId,
            reason: req.reason
        });
    } else { //替换
        await Callback_col.updateOne({
            documentId: req.documentId
        },{
            documentId: req.documentId,
            userId: req.userId,
            commentId: req.commentId,
            reason: req.reason
        });
    }
    if (req.type =='day') {
        await Documentday_col.updateMany({
            'documentId': req.documentId
        },{
            status: false
        });
    } else if (req.type == 'week') {
        await Documentweek_col.updateMany({
            'documentId': req.documentId
        },{
            status: false
        });
    } else { //month
        await Documentmonth_col.updateMany({
            'documentId': req.documentId
        },{
            status: false
        });
    }
    let result2 = await Status_col.findOne({
        'documentId': req.documentId
    });
    if(result2) {//标记退回，修改状态
        await Status_col.updateMany({
            'documentId': req.documentId
        },{
            status: '0'
        });
    } else { //标记退回，增加状态
        await Status_col.create({
            'documentId': req.documentId,
            'status': '0',
            'type': 'day'
        });
    }
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
    addModal,
    toDocumentweek,
    listDocumentweek,
    editDocumentweek,
    addDocumentweek,
    detailsDocumentweek,
    commitDocumentWeek,
    delteDocumentweek,
    seachDocumentweek,
    mergeDocumentweek,
    toDocumentmonth,
    listDocumentmonth,
    editDocumentmonth,
    addDocumentmonth,
    detailsDocumentmonth,
    commitDocumentMonth,
    delteDocumentmonth,
    seachDocumentmonth,
    mergeDocumentmonth,
    callbackDocument
}