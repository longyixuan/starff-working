/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-17 08:41:45
 */

const Task_col = require('./../models/task');
const TaskLog_col = require('./../models/taskLog');
const TaskLog_zt = require('./../models/taskZt');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    req.kssj = new Date(req.kssj);
    if (req.jssj) {
        req.jssj = new Date(req.jssj);
    }
    await Task_col.create(req);
    if (req.bz) { //写入日志
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
    let seachConfig2 = {}
    let seachConfigFlag2 = false;
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
        seachConfig2.$gte = new Date(req.kssj);
        seachConfigFlag2 = true;
    }
    if (req.jssj) {
        seachConfig2.$lte = new Date(req.jssj);
        seachConfigFlag2 = true;
    }
    let result2 = await TaskLog_col.find(seachConfigFlag2?{updateTime: seachConfig2}:{}).distinct("id").exec();
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
            $match: {
                ...{
                    id: {
                        '$in': result2
                    }
                },
                ...seachConfig
            }
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
                        xtId: '$xtId',
                        jbrId: '$jbrId',
                        kssj: '$kssj',
                        jssj: '$jssj',
                        rwzt: '$rwzt',
                        rwlx: '$rwlx',
                        jira: '$jira',
                        bz: '$bz',
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
        data: result,
        result2: result2
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
    if (req.jssj) {
        req.jssj = new Date(req.jssj);
    }
    await Task_col.updateOne({
        id: req.id
    }, req);
    if (req.bz) {
        let log = await TaskLog_col.findOne({
            id: req.id,
            updateTime: new Date(req.updateTime)
        });
        if (log) {
            await TaskLog_col.deleteMany({
                id: req.id,
                updateTime: new Date(req.updateTime)
            });
        }
        await TaskLog_col.create(req);
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
    const result = await TaskLog_col.findOne({
        id: req.id
    });
    if (result) { // 有备注不可删除
        ctx.body = {
            code: 0,
            msg: '已有工作记录，不可删除'
        };
    } else {
        await Task_col.deleteMany({
            id: req.id
        });
        ctx.body = {
            code: 1,
            msg: '删除成功'
        };
    }
}

const getLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
   let result = await TaskLog_col.find({
        id: req.id
    }).sort({ updateTime: -1 });
    ctx.body = {
        code: 1,
        data: result,
        msg: '查询成功'
    };
}

const getDayLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
   let result = await TaskLog_col.findOne({
        id: req.id,
        updateTime: new Date(req.updateTime)
    });
    ctx.body = {
        code: 1,
        data: result ? result.bz : '',
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

const ztAdd = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await TaskLog_zt.create({
        id: uuidv1(),
        name: req.name,
        order: req.order
    });
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const ztEdit = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await TaskLog_zt.updateOne({
        id: req.id
    }, {
        name: req.name,
        order: req.order
    });
    const result = await TaskLog_zt.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const ztDel = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await TaskLog_zt.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const ztList = async (ctx, next) => {
    ctx.status = 200;
    let result = await TaskLog_zt.find({}).sort({order: 1 });
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    getList,
    getListC,
    update,
    remove,
    getLog,
    getDayLog,
    hisLog,
    ztList,
    ztAdd,
    ztEdit,
    ztDel
}