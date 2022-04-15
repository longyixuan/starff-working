/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-14 17:17:07
 */

const sysTimeline_col = require('./../models/systimeline');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timelineId = uuidv1();
    await sysTimeline_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}
const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await sysTimeline_col.updateOne({
        timelineId: req.id
    },{
        islock: true
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const commit = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await sysTimeline_col.updateOne({
        timelineId: req.id
    },{
        commitStatus: true,
        commitTime: req.commitTime
    });
    ctx.body = {
        code: 1,
        msg: '提交成功'
    };
}

const back = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await sysTimeline_col.updateOne({
        timelineId: req.id
    },{
        commitStatus: false,
        commitTime: ''
    });
    ctx.body = {
        code: 1,
        msg: '退回成功'
    };
}

const apply = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await sysTimeline_col.updateOne({
        timelineId: req.id
    },{
        applyStatus: true,
        applyTime: req.applyTime
    });
    ctx.body = {
        code: 1,
        msg: '审核成功'
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    if (req.publishTime) {
        req.publishTimeStamp = new Date(req.publishTime);
    }
    await sysTimeline_col.updateOne({
        timelineId: req.id
    }, req);
    const result = await sysTimeline_col.findOne({
        timelineId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const getDetail = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await sysTimeline_col.findOne({'timelineId':req.id});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachConfig = {
        islock: false,
        applyStatus: true
    };
    if (req.system) {
        seachConfig.systemId = {
            '$in': req.system
        }
    }
    if (req.time) {
        seachConfig.publishTime = req.time;
    }
    if (req.jira) {
        seachConfig.jira = req.jira;
    }
    let result = await sysTimeline_col.find(seachConfig).skip((parseInt(req.current) - 1)*20).sort({publishTimeStamp: -1}).limit(20);
    let dsh = await sysTimeline_col.find(
        {
            islock: false,
            applyStatus: false
        }
    );
    const total = await sysTimeline_col.find().count();
    seachConfig.publishTime = '';
    let dbc = await sysTimeline_col.find(seachConfig); //没补充发布时间
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        dsh: dsh,
        dbc: dbc,
        total: total
    };
}

module.exports = {
    add,
    remove,
    update,
    getList,
    getDetail,
    back,
    commit,
    apply
}