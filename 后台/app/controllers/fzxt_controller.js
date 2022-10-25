/*
 * @Author: yinxl 
 * @Date: 2022-10-22 15:26:15 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-25 19:08:22
 */

const Fzxt_col = require('./../models/fzxt');
const FzxtTag_col = require('./../models/fzxtTag');
const uuidv1 = require('uuid/v1');

const addTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let tag = await FzxtTag_col.findOne({'name': req.name});
    if (tag) {
        ctx.body = {
            code: 0,
            msg: '请勿重新添加'
        };
        return;
    }
    req.id = uuidv1();
    await FzxtTag_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await FzxtTag_col.updateOne({
        id: req.id
    }, req);
    const result = await FzxtTag_col.findOne({
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
    let tag = await Fzxt_col.find({'pt': req.id});
    if (tag) {
        ctx.body = {
            code: 0,
            msg: '系统列表中已使用，请先在系统列表中解绑'
        };
        return;
    }
    await FzxtTag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listTag = async (ctx, next) => {
    ctx.status = 200;
    let result = await FzxtTag_col.find({}).sort({'order': -1});
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
    await Fzxt_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Fzxt_col.updateOne({
        id: req.id
    }, req);
    ctx.body = {
        code: 1,
        msg: '更新成功'
    };
}

const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Fzxt_col.updateOne({
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
    let result = await Fzxt_col.aggregate([
        {
            $lookup: {
                from: "fzxtTag",
                localField: "pt",
                foreignField: "id",
                as: "pt"
            }
        },
        {
            $match: match
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
                        ga: '$ga',
                        kfbm: '$kfbm',
                        qd: '$qd',
                        sj: '$sj'
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