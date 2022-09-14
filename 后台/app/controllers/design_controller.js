/*
 * @Author: yinxl 
 * @Date: 2022-09-02 12:40:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-09-14 09:12:33
 */

const Design_col = require('./../models/design');
const DesignTag_col = require('./../models/designTag');
const uuidv1 = require('uuid/v1');

const addTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await DesignTag_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await DesignTag_col.updateOne({
        id: req.id
    }, req);
    const result = await DesignTag_col.findOne({
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
    await DesignTag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listTag = async (ctx, next) => {
    ctx.status = 200;
    let result = await DesignTag_col.find({parentId: 'root'});
    let data = [];
    for (let i = 0; i < result.length;i++) {
        let children = await DesignTag_col.find({
            parentId: result[i].id
        })
        data.push({
            id: result[i].id,
            hasDes: result[i].hasDes,
            name: result[i].name,
            order: result[i].order,
            parentId: result[i].parentId,
            child: children
        });
    }
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: data
    };
}

const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    for(let i = 0;i<req.data.length;i++) {
        let data = await Design_col.findOne({
            month: req.data[i].month,
            year: req.data[i].year,
            userId: req.data[i].userId,
            tagId: req.data[i].tagId
        })
        if (data) {
            await Design_col.updateOne({
                month: req.data[i].month,
                year: req.data[i].year,
                userId: req.data[i].userId,
                tagId: req.data[i].tagId
            }, req.data[i]);
        } else {
            req.data[i].id = uuidv1();
            await Design_col.create(req.data[i]);
        }
    };
    let result = await Design_col.find({});
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: result
    };
}

const detail = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year),
                userId: req.userId
            }
        },
        {
            $group: {
                _id: {
                    month: '$month'
                },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                content: "$content"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    const result2 = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year),
                userId: req.userId
            }
        },
        {
            $group: {
                _id: {
                    tagId: '$tagId'
                },
                sum: { $sum: '$tagNum' },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                tagId: "$_id.tagId",
                content: "$content",
                sum: "$sum"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    const result3 = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year)
            }
        },
        {
            $group: {
                _id: {
                    tagId: '$tagId'
                },
                sum: { $sum: '$tagNum' },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                tagId: "$_id.tagId",
                content: "$content",
                sum: "$sum"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        data2: result2,
        data3: result3
    };
}

const all = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year)
            }
        },
        {
            $group: {
                _id: {
                    month: '$month',
                },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                content: "$content"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    const result2 = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year)
            }
        },
        {
            $group: {
                _id: {
                    tagId: '$tagId'
                },
                sum: { $sum: '$tagNum' },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                tagId: "$_id.tagId",
                content: "$content",
                sum: "$sum"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    const result3 = await Design_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user_info"
            }
        },
        {
            $match: {
                year: parseInt(req.year)
            }
        },
        {
            $group: {
                _id: {
                    tagId: '$tagId'
                },
                sum: { $sum: '$tagNum' },
                content: {
                    $push: {
                        id: '$id',
                        userId: '$userId',
                        nickName: {$arrayElemAt:["$user_info.nickName",0]},
                        year: '$year',
                        month: '$month',
                        tagId: '$tagId',
                        tagNum: '$tagNum',
                        tagDes: '$tagDes',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                tagId: "$_id.tagId",
                content: "$content",
                sum: "$sum"
            }
        },
        {
            $sort: {
                month: 1 //排序规则
            }
        }
    ])
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        data2: result2,
        data3: result3
    };
}

module.exports = {
    addTag,
    listTag,
    updateTag,
    removeTag,
    add,
    detail,
    all
}