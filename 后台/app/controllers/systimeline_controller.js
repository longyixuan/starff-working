/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-22 16:29:57
 */

const sysTimeline_col = require('./../models/systimeline');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timelineId = uuidv1();
    if (req.sqsj) {
        req.sqsjStamp = new Date(req.sqsj);
    }
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
    let query = {
        jira: req.jira,
        systemId: req.systemId,
        systemName: req.systemName,
        bz: req.bz
    }
    if (req.publishTime) {
        query.publishTime = req.publishTime;
        query.publishTimeStamp = new Date(req.publishTime);
    }
    await sysTimeline_col.updateOne({
        timelineId: req.id
    }, query);
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
    if (req.userType == '0') {
        seachConfig.userName = req.userName;
    }
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
    let result = await sysTimeline_col.find(seachConfig).sort({publishTimeStamp: -1}).skip((parseInt(req.current) - 1)*20).limit(20);
    let dsh = [];
    if (req.userType == '0') {
        dsh = await sysTimeline_col.find(
            {
                islock: false,
                applyStatus: false,
                userName: req.userName
            }
        ).sort({sqsjStamp: -1});
    } else {
        dsh = await sysTimeline_col.find(
            {
                islock: false,
                applyStatus: false
            }
        ).sort({sqsjStamp: -1});
    }
    let total = 0;
    if (req.userType == '0') {
        total = await sysTimeline_col.find({islock: false,applyStatus: true, userName: req.userName}).count();
    } else {
        total = await sysTimeline_col.find({islock: false,applyStatus: true}).count();
    }
    seachConfig.publishTime = '';
    let dbc = await sysTimeline_col.find(seachConfig); //没补充发布时间
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        dsh: dsh,
        dbc: dbc,
        total: total,
        seachConfig: seachConfig
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