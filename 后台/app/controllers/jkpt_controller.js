/*
 * @Author: yinxl 
 * @Date: 2022-10-22 15:26:15 
 * @Last Modified by: yinxl
 * @Last Modified time: 2024-01-10 13:45:00
 */

const Jkpt_col = require('./../models/jkpt');
const JkptTag_col = require('./../models/jkptTag');
const uuidv1 = require('uuid/v1');

const addTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let tag = await JkptTag_col.findOne({'name': req.name});
    if (tag) {
        ctx.body = {
            code: 0,
            msg: '请勿重新添加'
        };
        return;
    }
    req.id = uuidv1();
    await JkptTag_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await JkptTag_col.updateOne({
        id: req.id
    }, req);
    const result = await JkptTag_col.findOne({
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
    let tag = await Jkpt_col.find({'pt': req.id});
    if (tag) {
        ctx.body = {
            code: 0,
            msg: '系统列表中已使用，请先在系统列表中解绑'
        };
        return;
    }
    await JkptTag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listTag = async (ctx, next) => {
    ctx.status = 200;
    let result = await JkptTag_col.find({}).sort({'order': -1});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Jkpt_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const data = {
        pt: req.pt?req.pt:'',
        wz: req.wz?req.wz:'',
        xtmc: req.xtmc,
        sjbm: req.sjbm?req.sjbm:[],
        kfbm: req.kfbm?req.kfbm:[],
        qd: req.qd?req.qd:[],
        sj: req.sj?req.sj:[],
        bz: req.bz?req.bz:'',
        order: parseInt(req.order)
    }
    console.log(data)
    await Jkpt_col.updateOne({
        id: req.id
    }, data);
    ctx.body = {
        code: 1,
        msg: '更新成功'
    };
}

const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Jkpt_col.updateOne({
        id: req.id
    }, {
        flag: true
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const match = {
        flag: false
    }
    if (req.xtmc) {
        const reg = new RegExp(req.xtmc, 'i');
        match.xtmc = { $regex : reg }
    }
    if (req.sjbm) {
        match.sjbm = req.sjbm
    }
    if (req.xm) {
        match.$or = [
            {
                'qd': {
                    $elemMatch: {
                        $eq: req.xm
                    }
                }
            },
            {
                'sj': {
                    $elemMatch: {
                        $eq: req.xm
                    }
                }
            }
        ]
    }
    let result = await Jkpt_col.aggregate([
        {
            $lookup: {
                from: "jkptTag",
                localField: "pt",
                foreignField: "id",
                as: "pt"
            }
        },
        {
            $match: match
        },
        {
            $sort: {
                order: 1 //排序规则
            }
        },
        {
            $group: {
                _id: {
                    pt: '$pt'
                },
                content: {
                    $push: {
                        ptId: {$arrayElemAt:["$pt.id",0]},
                        pt: {$arrayElemAt:["$pt.name",0]},
                        id: '$id',
                        xtmc: '$xtmc',
                        wz: '$wz',
                        bz: '$bz',
                        sjbm: '$sjbm',
                        kfbm: '$kfbm',
                        qd: '$qd',
                        sj: '$sj',
                        order: '$order',
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                pt: {$arrayElemAt:["$_id.pt.name",0]},
                order: {$arrayElemAt:["$_id.pt.order",0]},
                list: '$content'
            }
        },
        {
            $sort: {
                'order': -1
            }
        }
    ]);
    ctx.body = {
        code: 1,
        data: result,
        msg: '查询成功'
    };
}

module.exports = {
    addTag,
    updateTag,
    removeTag,
    listTag,
    add,
    update,
    remove,
    getList
}