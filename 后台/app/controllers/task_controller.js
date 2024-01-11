/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-09-22 10:06:25
 */

const Task_col = require('./../models/task');
const TaskLog_col = require('./../models/taskLog');
const TaskLog_zt = require('./../models/taskZt');
const User_col = require("./../models/user");
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
    if (req.type == 'rw') {
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
    } else {
        if (req.kssj) {
            seachConfig2.$gte = new Date(req.kssj);
            seachConfigFlag2 = true;
        }
        if (req.jssj) {
            seachConfig2.$lte = new Date(req.jssj);
            seachConfigFlag2 = true;
        }
        let result2 = await TaskLog_col.find(seachConfigFlag2?{updateTime: seachConfig2}:{}).distinct("id").exec();
        seachConfig.id = {
            '$in': result2
        }
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
                from: "user",
                localField: "jbrId",
                foreignField: "userName",
                as: "user"
            }
        },
        {
            $lookup: {
                from: "taskLog",
                // localField: "id",
                // foreignField: "id",
                let: {
                    id: "$id",
                  },
                pipeline: [
                    {
                        $match: {
                            '$expr': {
                                '$eq': ['$id', '$$id']
                            }
                        }
                    },
                    {
                        '$sort': { updateTime: -1}
                    },
                    {
                        $project: {
                            _id: 0,
                            id: '$id',
                            updateTime: '$updateTime',
                            updateTimeStr: {
                                $dateToString: {
                                    format: "%Y年%m月%d日",
                                    date: "$updateTime"
                                }
                            },
                            duration: {"$divide":[{$subtract: ['$updateTime', '$kssj'] }, 1000 * 60 * 60 * 24]},
                            bz: '$bz'
                        }
                    }
                ],
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
            $addFields: {
                taskLogLast: { $arrayElemAt:["$taskLog", 0] }
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
                        jbrName: {$arrayElemAt:["$user.nickName",0]},
                        kssj: '$kssj',
                        jssj: '$jssj',
                        rwzt: '$rwzt',
                        rwlx: '$rwlx',
                        jira: '$jira',
                        bz: '$bz',
                        isHistory: '$isHistory',
                        taskLog: '$taskLog',
                        duration: {"$divide":[{$subtract: ['$jssj', '$kssj'] }, 1000 * 60 * 60 * 24]},
                        logSize: {$size: '$taskLog'},
                        updateTime: '$taskLogLast.updateTime',
                        duration2: {"$divide":[{$subtract: [ '$taskLogLast.updateTime', '$kssj'] }, 1000 * 60 * 60 * 24]},
                        duration3: {"$divide":[{$subtract: [ '$taskLogLast.updateTime', '$jssj'] }, 1000 * 60 * 60 * 24]}
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
    ]);
    let list = await Task_col.aggregate([
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
                // localField: "id",
                // foreignField: "id",
                let: {
                    id: "$id"
                  },
                pipeline: [
                    {
                        $match: {
                            '$expr': {
                                '$eq': ['$id', '$$id']
                            }
                        }
                    },
                    {
                        '$sort': { updateTime: -1}
                    }
                ],
                as: "taskLog"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "jbrId",
                foreignField: "userName",
                as: "user"
            }
        },
        {
            $lookup: {
                from: "taskZt",
                localField: "rwzt",
                foreignField: "id",
                as: "taskZt"
            }
        },
        {
            $match: seachConfig
        },
        {
            $sort: {
                'kssj': -1,
                'created_at': -1,
                'updated_at': -1
            }
        },
        {
            $addFields: {
                taskLogLast: { $arrayElemAt:["$taskLog", 0] }
            }
        },
        {
            $project: {
                _id: 0,
                id: '$id',
                rwmc: '$rwmc',
                xtId: '$xtId',
                xtmc: {$arrayElemAt:["$system.title",0]},
                jbrId: '$jbrId',
                jbrName: {$arrayElemAt:["$user.nickName",0]},
                kssj: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$kssj"
                    }
                },
                jssj: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$jssj"
                    }
                },
                rwztDes: {$arrayElemAt:["$taskZt.name",0]},
                rwzt: '$rwzt',
                rwlx: '$rwlx',
                jira: '$jira',
                bz: '$bz',
                isHistory: '$isHistory',
                taskLog: '$taskLog',
                duration: {"$divide":[{$subtract: ['$jssj', '$kssj'] }, 1000 * 60 * 60 * 24]},
                logSize: {$size: '$taskLog'},
                updateTime: '$taskLogLast.updateTime',
                duration2: {"$divide":[{$subtract: [ '$taskLogLast.updateTime', '$kssj'] }, 1000 * 60 * 60 * 24]},
                duration3: {"$divide":[{$subtract: [ '$taskLogLast.updateTime', '$jssj'] }, 1000 * 60 * 60 * 24]}
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        list: list
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
    await Task_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
    // const result = await TaskLog_col.findOne({
    //     id: req.id
    // });
    // if (result) {
    //     ctx.body = {
    //         code: 0,
    //         msg: '已有工作记录，不可删除'
    //     };
    // } else {
    //     await Task_col.deleteMany({
    //         id: req.id
    //     });
    //     ctx.body = {
    //         code: 1,
    //         msg: '删除成功'
    //     };
    // }
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
const checkLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let result = await TaskLog_col.find({
        updateTime: new Date(req.updateTime)
    }).distinct("jbrId").exec();
    let userList = await User_col.aggregate([
        {
            $match: {
                defaultRole: {
                    $ne: ''
                },
                delFlag: 0
            }
        },
        {
            $group: {
                _id: {
                    departmentTitle: '$departmentTitle',
                },
                content: {
                    $push: {
                        userName: '$userName',
                        nickName: '$nickName',
                        departmentId: '$departmentId',
                        departmentTitle: '$departmentTitle'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                departmentTitle: '$_id.departmentTitle',
                list: '$content'
            }
        },
    ]);
    let temp = []; //设计一部未写总结人员
    let temp1 = []; //设计二部未写总结人员
    if (result.length>0) { //有人写总结
        for (let i = 0; i < userList.length; i++) {
            let element = userList[i];
            for (let j = 0; j < element.list.length; j++) {
                let item = element.list[j];
                if (!result.includes(item.userName)) { //未写总结
                    if (element.departmentTitle=="设计一部") {
                        temp.push(item.nickName)
                    } else {
                        temp1.push(item.nickName)
                    }
                }
            }
        }
    }
    ctx.body = {
        code: 1,
        data: temp,
        data1: temp1,
        msg: '查询成功'
    }
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

const tongji = async (ctx, next) => {
    const req = ctx.request.body;
    let result = await TaskLog_col.aggregate([
        {
            $match: {
                'updateTime': {
                    $gte: new Date(req.startDate),
                    $lte: new Date(req.endDate)
                }
            }
        },
        {
            $group: {
                _id: {
                    updateTime: '$updateTime',
                },
                content: {
                    $push: {
                        "updateTime": '$updateTime',
                        "id": "$id",
                        "rwmc": "$rwmc",
                        "xtId": "$xtId",
                        "rwlx": "$rwlx",
                        "rwzt": "$rwzt",
                        "jbrId": "$jbrId",
                        "jira": "$jira",
                        "kssj": "$kssj",
                        "jssj": "$jssj",
                        "bz": "$bz",
                        "wcsj": "$wcsj"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$_id.updateTime"
                    }
                },
                count: {
                    $size: '$content'
                }
            }
        }
    ]);
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
    checkLog,
    ztList,
    ztAdd,
    ztEdit,
    ztDel,
    tongji
}