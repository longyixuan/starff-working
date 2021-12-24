/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-12-24 10:10:10
 */

const Timeline_col = require('./../models/timeline');
const Tag_col = require('./../models/tag');
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
    await Timeline_col.updateOne({
        timelineId: req.id
    },{
        islock: true
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
    let seachConfig = {
        islock: false
    };
    let groupConfig = {
        _id: {
            timeStamp: '$timeStamp',
            time: '$time'
        },
        details: {
            $push: {
                model: '$model',
                description: '$description',
                userName: '$userName',
                tag: '$tag',
                systemId: '$systemId',
                systemName: '$systemName',
                timelineId: '$timelineId',
                timeStamp: '$timeStamp',
                time: '$time'
            }
        }
    };
    if (req.system) {
        seachConfig.systemId = {
            '$in': req.system
        }
    }
    if (req.tag) {
        seachConfig.tag = req.tag
    }
    if (req.year) {
        seachConfig.time = {
            "$regex": req.year
        }
    }
    let result = await Timeline_col.aggregate([{
        $match: seachConfig
    }]);
    let result2 = await Timeline_col.aggregate([{
        $match: seachConfig
    },{
        $group: groupConfig
    }]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        timeSys: result2
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

const addTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Tag_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tag_col.updateOne({
        id: req.id
    }, req);
    const result = await Tag_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const removeTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listTag = async (ctx, next) => {
    ctx.status = 200;
    let result = await Tag_col.find({});
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
    getDetail,
    addTag,
    updateTag,
    removeTag,
    listTag
}