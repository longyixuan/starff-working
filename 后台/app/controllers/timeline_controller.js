/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-07 21:02:01
 */

const Timeline_col = require('./../models/timeline');
const System_col = require('./../models/system');
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
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}
const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    if (!req.system) {
        req.system = [];
        let systemList = await System_col.find();
        systemList.forEach((item) => {
            req.system.push(item.id)
        })
    }
    if (!req.tag) {
        req.tag = [
            '发布',
            '系统开通',
            '系统关闭'
        ]
    }else {
        req.tag = [req.tag];
    }
    if (!req.startTime) {
        req.startTime = '1900-01-01'
    }
    if (!req.endTime) {
        req.endTime = '3000-01-01'
    }
    let result = await Timeline_col.aggregate([{
        $match: {
            'systemId': {
                '$in': req.system
            },
            'tag': {
                '$in': req.tag
            },
            'timeStamp': {
                $gte: new Date(req.startTime),
                $lte: new Date(req.endTime)
            }
        }
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

module.exports = {
    add,
    remove,
    update,
    getList,
    exportExcel
}