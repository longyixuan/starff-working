/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-08 11:38:53
 */

const Timeline_col = require('./../models/timeline');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timelineId = uuidv1();
    req.timeStamp = new Date(req.time);
    await Timeline_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}
const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Timeline_col.remove({
        timelineId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timeStamp = new Date(req.time);
    await Timeline_col.updateOne({
        timelineId: req.id
    }, req);
    const result = await Timeline_col.findOne({
        timelineId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}
const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    var seachConfig = {};
    if (req.system) {
        seachConfig.systemId = {
            '$in': req.system
        }
    }
    if (req.tag) {
        seachConfig.tag = req.tag
    }
    if (req.startTime && req.endTime) {
        seachConfig.timeStamp = {
            '$gte': new Date(req.startTime),
            '$lte': new Date(req.endTime)
        }
    }
    let result = await Timeline_col.aggregate([{
        $match: seachConfig
    }]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const exportExcel = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}

const lock = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}

const getDetail = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Timeline_col.findOne({'timelineId':req.id});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    remove,
    update,
    getList,
    exportExcel,
    lock,
    getDetail
}