/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-26 17:00:32
 */

const Tasklist_Congig = require('./../models/tasklistConfig');
const Tasklist = require('./../models/tasklist');
const uuidv1 = require('uuid/v1');

const ztAdd = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tasklist_Congig.create({
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
    await Tasklist_Congig.updateOne({
        id: req.id
    }, {
        name: req.name,
        order: req.order
    });
    const result = await Tasklist_Congig.findOne({
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
    await Tasklist_Congig.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}
const ztEnum = new Map([
    ['dsj', '待设计'],
    ['sjz', '设计中'],
    ['dkf', '待开发'],
    ['kfz', '开发中'],
    ['dcs', '待测试'],
    ['csz', '测试中'],
    ['dfb', '待发布'],
    ['yfb', '已发布']
]);

const ztList = async (ctx, next) => {
    ctx.status = 200;
    const list = Array.from(ztEnum, ([key, value]) => {
        return { key, value };
      });
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: list
    };
}

// 任务清单

const Add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tasklist.create({
        id: uuidv1(),
        name: req.name,
        list: JSON.parse(req.list)
    });
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const Edit = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tasklist.updateOne({
        id: req.id
    }, {
        name: req.name,
        list: JSON.parse(req.list)
    });
    const result = await Tasklist.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const Del = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tasklist.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const List = async (ctx, next) => {
    ctx.status = 200;
    let result = await Tasklist.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const Detail = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let result = await Tasklist.findOne({id: req.id});
    if (result) {
        ctx.body = {
            code: 1,
            msg: '',
            data: result
        };
    } else {
        ctx.body = {
            code: 0,
            msg: '该任务清单不存在',
            data: result
        };
    }
}


module.exports = {
    ztList,
    ztAdd,
    ztEdit,
    ztDel,
    List,
    Add,
    Edit,
    Del,
    Detail
}