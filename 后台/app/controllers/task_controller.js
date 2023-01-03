/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-14 16:16:17
 */

const Task_col = require('./../models/task');
const TaskLog_col = require('./../models/taskLog');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    req.kssj = new Date(req.kssj);
    req.jssj = new Date(req.jssj);
    await Task_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachConfig = {};
    if (req.hasOwnProperty('isHistory')) {
        seachConfig.isHistory = Boolean(req.isHistory);
    } else {
        seachConfig.isHistory = false;
    }
    if (req.hasOwnProperty('frwId')) {
        seachConfig.frwId = req.frwId;
    }
    if (req.xtId) {
        seachConfig.xtId = {
            '$in': req.xtId
        };
    }
    if (req.rwmc) {
        let regexp=new RegExp(req.rwmc,'i')
        seachConfig.rwmc = {
            "$regex": regexp
        }
    }
    if (req.rwzt) {
        seachConfig.rwzt = {
            '$in': req.rwzt
        };
    }
    if (req.jbrId) {
        seachConfig.jbrId = {
            '$in': req.jbrId
        };
    }
    if (req.kssj) {
        seachConfig.kssj = {
            $gte: new Date(req.kssj)
        };
    }
    if (req.jssj) {
        seachConfig.jssj = {
            $lte: new Date(req.jssj)
        };
    }
    let result = await Task_col.aggregate([
        {
            $lookup: {
                from: "system",
                localField: "xtId",
                foreignField: "id",
                as: "system"
            }
        },
        {
            $lookup: {
                from: "taskLog",
                localField: "id",
                foreignField: "id",
                as: "taskLog"
            }
        },
        {
            $match: seachConfig
        },
        {
            $sort: {
                'created_at': -1
            }
        },
        {
            $group: {
                _id: {
                    xtId: '$xtId',
                    xtmc: {$arrayElemAt:["$system.title",0]}
                },
                content: {
                    $push: {
                        id: '$id',
                        rwmc: '$rwmc',
                        frwId: '$frwId',
                        xtId: '$xtId',
                        jbrId: '$jbrId',
                        kssj: '$kssj',
                        jssj: '$jssj',
                        wcsj: '$wcsj',
                        rwzt: '$rwzt',
                        rwlx: '$rwlx',
                        jira: '$jira',
                        bz: '$bz',
                        rwjz: '$rwjz',
                        isHistory: '$isHistory',
                        taskLog: '$taskLog'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                xtId: '$_id.xtId',
                xtmc: '$_id.xtmc',
                rwList: '$content'
            }
        },
        {
            $sort: {
                'xtmc': 1
            }
        }
        // {
        //     $skip: (Number(2) - 1) * Number(1)
        // },
        // {
        //     $limit: 1
        // }
    ]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const getListC = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let result = await Task_col.aggregate([
        {
            $lookup: {
                from: "taskLog",
                localField: "id",
                foreignField: "id",
                as: "taskLog"
            }
        },
        {
            $match: {
                frwId: req.frwId,
                isHistory: false
            }
        },
        {
            $sort: {
                'created_at': -1
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.kssj = new Date(req.kssj);
    req.jssj = new Date(req.jssj);
    req.wcsj = new Date(req.updateTime);
    await Task_col.updateOne({
        id: req.id
    }, req);
    if (req.bz) {
        let log = await TaskLog_col.findOne({
            id: req.id,
            updateTime: new Date(req.updateTime)
        });
        if (log) {
            await TaskLog_col.updateOne({
                id: req.id
            },req);
        } else {
            await TaskLog_col.create(req);
        }
    }
    const result = await Task_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Task_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const getLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
   let result = await TaskLog_col.find({
        id: req.id
    }).sort({ updateTime: 1 });
    ctx.body = {
        code: 1,
        data: result,
        msg: '查询成功'
    };
}

const hisLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Task_col.updateMany({
        id: req.id
    }, {
        isHistory: req.isHistory == 'false' ? false : true
    });
    ctx.body = {
        code: 1,
        msg: '操作成功'
    };
}

module.exports = {
    add,
    getList,
    getListC,
    update,
    remove,
    getLog,
    hisLog
}