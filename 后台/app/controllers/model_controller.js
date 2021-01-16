const Model_col = require('./../models/model');
const System_col = require('./../models/system');
const Documentday_col = require('./../models/documentDay');
const Documentweek_col = require('./../models/documentWeek');
const Documentmonth_col = require('./../models/documentMonth');

const uuidv1 = require('uuid/v1');


const refresh = async (ctx, next) => {
    ctx.status = 200;
    // 旧数据更新：把系统模块刷到模块里
    const system = await System_col.find().ne('parentId', '0');
    var insertList = [];
    system.forEach(item => {
        item.modal.forEach(item2 => {
            insertList.push({
                modelId:uuidv1(),
                systemId: item.id,
                modelName: item2
            });
        });
    });
    await Model_col.insertMany(insertList);
    const dayResult = await Documentday_col.find();
    const weekResult = await Documentweek_col.find();
    const monthResult = await Documentmonth_col.find();
    const ModelResult = await Model_col.find();
    dayResult.forEach( (item) => {
        ModelResult.forEach(item2=> {
            if (item2.systemId==item.systemId&&item.contentTitle==item2.modelName) {
                item.tempId = item2.modelId;
            } else {
            }
        });
    });
    for (let i = 0; i < dayResult.length; i++) {
        await Documentday_col.updateMany({
            documentId: dayResult[i].documentId,
            contentTitle: dayResult[i].contentTitle
        },{$set:{"contentTitle": dayResult[i].tempId}})
    }
    weekResult.forEach( (item) => {
        ModelResult.forEach(item2=> {
            if (item2.systemId==item.systemId&&item.contentTitle==item2.modelName) {
                item.tempId = item2.modelId;
            } else {
            }
        });
    });
    for (let j = 0; j < weekResult.length; j++) {
        await Documentweek_col.updateMany({
            documentId: weekResult[j].documentId,
            contentTitle: weekResult[j].contentTitle
        },{$set:{"contentTitle": weekResult[j].tempId}})
    }
    monthResult.forEach( (item) => {
        ModelResult.forEach(item2=> {
            if (item2.systemId==item.systemId&&item.contentTitle==item2.modelName) {
                item.tempId = item2.modelId;
            } else {
            }
        });
    });
    for (let k = 0; k < monthResult.length; k++) {
        await Documentmonth_col.updateMany({
            documentId: monthResult[k].documentId,
            contentTitle: monthResult[k].contentTitle
        },{$set:{"contentTitle": monthResult[k].tempId}})
    }
    ctx.body = {
        code: 1,
        msg: '旧数据已更新'
    };
}
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Model_col.findOne({
        systemId: req.systemId,
        modelName: req.modelName
    });
    if (!result) {
        req.modelId = uuidv1();
        await Model_col.create(req);
        ctx.body = {
            code: 1,
            msg: '新增成功'
        };
    } else {
        ctx.body = {
            code: 0,
            msg: '模块名称重复'
        };
    }
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Model_col.updateOne({
        modelId: req.id
    }, req);
    const result = await Model_col.findOne({
        modelId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}
const del = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    var dayDoc = await Documentday_col.findOne({
        contentTitle: req.id,
        systemId: req.sysId
    })
    if (!dayDoc) {
        await Model_col.deleteMany({
            modelId: req.id
        });
        ctx.body = {
            code: 1,
            msg: '删除成功'
        };
    } else {
        ctx.body = {
            code: 0,
            msg: '已在工作总结中使用，不可删除'
        };
    }
    
}
const getlist = async (ctx, next) => {
    ctx.status = 200;
    let result = await Model_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    update,
    del,
    getlist,
    refresh
}