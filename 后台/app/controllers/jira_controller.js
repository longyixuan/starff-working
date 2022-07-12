/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-12 10:05:56
 */

const uuidv1 = require('uuid/v1');
const jira_col = require('./../models/jira');
const User_col = require('./../models/user');
const issueType = { //暂时无用
    total: 'total',
    bug: 'bug',
    task: 'task'
}
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    for (let i=0;i<req.list.length;i++) {
        let element = req.list[i];
        let jira = await jira_col.findOne({
            userName: element.userName,
            year: req.year,
            month: req.month
        });
        if (jira) {
            await jira_col.updateOne({
                jiraId: jira.jiraId
            },{
                userName: element.userName,
                year: req.year,
                month: req.month,
                total: element.total,
                bug: element.bug,
                total1: element.total1,
                bug1: element.bug1
            });
        } else {
            await jira_col.create({
                jiraId: uuidv1(),
                userName: element.userName,
                year: req.year,
                month: req.month,
                total: element.total,
                bug: element.bug,
                total1: element.total1,
                bug1: element.bug1
            });
        }
    }
    const result = await jira_col.find({
        year: req.year,
        month: req.month}
    );
    ctx.body = {
        code: 1,
        msg: '保存成功',
        data: result
    };
    // const jira = await jira_col.findOne({
    //     userName: req.userName,
    //     year: req.year,
    //     month: req.month,
    //     isFinshed: req.isFinshed,
    // });
    // if (jira) {
    //     await jira_col.updateOne({
    //         jiraId: jira.jiraId
    //     },{
    //         userName: req.userName,
    //         year: req.year,
    //         month: req.month,
    //         isFinshed: req.isFinshed,
    //         total: req.total,
    //         bug: req.bug,
    //         task: req.task
    //     });
    //     ctx.body = {
    //         code: 1,
    //         msg: '数据替换成功'
    //     };
    // } else {
    //     await jira_col.create({
    //         jiraId: uuidv1(),
    //         userName: req.userName,
    //         year: req.year,
    //         month: req.month,
    //         isFinshed: req.isFinshed,
    //         total: req.total,
    //         bug: req.bug,
    //         task: req.task
    //     });
    //     ctx.body = {
    //         code: 1,
    //         msg: '新增成功'
    //     };
    // }
}
const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await jira_col.remove({
        jiraId: req.jiraId
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await jira_col.updateOne({
        jiraId: req.jiraId
    },req);
    ctx.body = {
        code: 1,
        msg: '修改成功'
    };
}

const getDetailP = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await jira_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userName",
                foreignField: "userName",
                as: "user_info"
            }
        },
        {
            $match: req
        },
        {
            $group: {
                _id: {
                    month: '$month',
                    user_info: '$user_info'
                },
                content: {
                    $push: {
                        jiraId: '$jiraId',
                        userId: '$userId',
                        userName: '$userName',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        total: {'$subtract':['$total','$bug']},
                        bug: '$bug',
                        total1: {'$subtract':['$total1','$bug1']},
                        bug1: '$bug1',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                jiraId: {$arrayElemAt:["$content.jiraId",0]},
                userId: {$arrayElemAt:["$content.userId",0]},
                userName: {$arrayElemAt:["$content.userName",0]},
                nickName: {$arrayElemAt:["$content.nickName",0]},
                year: {$arrayElemAt:["$content.year",0]},
                month: {$arrayElemAt:["$content.month",0]},
                isFinshed: {$arrayElemAt:["$content.isFinshed",0]},
                total: {$arrayElemAt:["$content.total",0]},
                bug: {$arrayElemAt:["$content.bug",0]},
                total1: {$arrayElemAt:["$content.total1",0]},
                bug1: {$arrayElemAt:["$content.bug1",0]}
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const getDetailM = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const userListSj = req.userListSj;
    const userListQd = req.userListQd;
    let seachConfig = {
        year: req.year
    };
    if (req.month) { //按月
        seachConfig.month = req.month;
    } else { //全年
    }
    const sj = await jira_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userName",
                foreignField: "userName",
                as: "user_info"
            }
        },
        {
            $match: {
                ...seachConfig,
                ...{
                    userName: {
                        $in: userListSj
                    },
                }}
        },
        {
            $group: {
                _id: {
                    userName: '$userName',
                    user_info: '$user_info'
                },
                content: {
                    $push: {
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        userName: '$userName'
                    }
                },
                total: {
                    $sum: '$total'
                },
                bug: {
                    $sum: '$bug'
                },
                total1: {
                    $sum: '$total1'
                },
                bug1: {
                    $sum: '$bug1'
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: {$arrayElemAt:["$content.userName",0]},
                nickName: {$arrayElemAt:["$content.nickName",0]},
                total: {'$subtract':['$total','$bug']},
                bug: '$bug',
                total1: {'$subtract':['$total1','$bug1']},
                bug1: '$bug1'
            }
        },
        {
            $sort://排序关键词
            {
                total: -1//排序规则
            }
        }
    ]);
    const qd = await jira_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userName",
                foreignField: "userName",
                as: "user_info"
            }
        },
        {
            $match: {
                ...seachConfig,
                ...{
                    userName: {
                        $in: userListQd
                    }
                }}
        },
        {
            $group: {
                _id: {
                    userName: '$userName',
                    user_info: '$user_info'
                },
                content: {
                    $push: {
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        userName: '$userName'
                    }
                },
                total: {
                    $sum: '$total'
                },
                bug: {
                    $sum: '$bug'
                },
                total1: {
                    $sum: '$total1'
                },
                bug1: {
                    $sum: '$bug1'
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: {$arrayElemAt:["$content.userName",0]},
                nickName: {$arrayElemAt:["$content.nickName",0]},
                total: {'$subtract':['$total','$bug']},
                bug: '$bug',
                total1: {'$subtract':['$total1','$bug1']},
                bug1: '$bug1'
            }
        },
        {
            $sort://排序关键词
            {
                total: -1//排序规则
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: {
            sj: sj,
            qd: qd
        }
    };
}

const getDetailY = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachConfig = {
        year: req.year
    };
    const result = await jira_col.aggregate([
        {
            $match: {
                ...seachConfig
            }
        },
        {
            $group: {
                _id: {
                    month: '$month'
                },
                total: {
                    $sum: '$total'
                },
                bug: {
                    $sum: '$bug'
                },
                total1: {
                    $sum: '$total1'
                },
                bug1: {
                    $sum: '$bug1'
                }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                total: {'$subtract':['$total','$bug']},
                bug: '$bug',
                total1: {'$subtract':['$total1','$bug1']},
                bug1: '$bug1'
            }
        },
        {
            $sort://排序关键词
            {
                month:-1//排序规则
            }
        }
    ]);
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
        year: req.year,
        month: req.month
    };
    let result = await jira_col.find(seachConfig).sort({'total': -1});
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
    getDetailP,
    getDetailM,
    getDetailY
}