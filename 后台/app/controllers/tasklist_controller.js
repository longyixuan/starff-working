/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-19 18:04:49
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
    ['DSJ', '待设计'],
    ['SJZ', '设计中'],
    ['DKF', '待开发'],
    ['KFZ', '开发中'],
    ['DCS', '待测试'],
    ['CSZ', '测试中'],
    ['DFB', '待发布'],
    ['YFB', '已发布']
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
        content: req.content
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
        order: req.order
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
    let result = await Tasklist.find({}).sort({order: 1 });
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}


module.exports = {
    ztList,
    ztAdd,
    ztEdit,
    ztDel,
    List,
    Add,
    Edit,
    Del
}