/*
 * @Author: yinxl
 * @Date: 2022-07-21 13:43:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-20 11:49:59
 */

const Md_col = require('./../models/md');
const MdType_col = require('./../models/mdType');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let md = await Md_col.findOne({
        title: req.title
    });
    if (md) {
        ctx.body = {
            code: 0,
            msg: '该目录下已有内容，请返回列表中查看'
        };
    } else {
        req.id = uuidv1();
        await Md_col.create(req);
        ctx.body = {
            code: 1,
            msg: '新增成功'
        };
    }
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Md_col.updateOne({
        id: req.id
    }, req);
    const result = await Md_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const list = async (ctx, next) => {
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                titleDes: {$arrayElemAt:["$mdType.name",0]}
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    }
};

const detail = async (ctx, next) => {
    const req = ctx.request.body;
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $match: {
                id: req.id
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                titleDes: {$arrayElemAt:["$mdType.name",0]},
                mdCode: '$mdCode',
                htmlCode: '$htmlCode'
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result.length>0?result[0]:null
    }
};

const addType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.create({
        id: uuidv1(),
        name: req.name,
        order: req.order
    });
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.updateOne({
        id: req.id
    }, {
        name: req.name,
        order: req.order
    });
    const result = await MdType_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const delType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listType = async (ctx, next) => {
    ctx.status = 200;
    let result = await MdType_col.find({}).sort({order: 1 });
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    list,
    update,
    detail,
    addType,
    listType,
    updateType,
    delType
}