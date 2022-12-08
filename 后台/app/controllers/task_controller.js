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
                'frwId': '',
            }
        }
    ]);
    let result2 = await TaskLog_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result,
        data2: result2
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.kssj = new Date(req.kssj);
    req.jssj = new Date(req.jssj);
    console.log(req)
    await Task_col.updateOne({
        id: req.id
    }, req);
    await TaskLog_col.create(req);
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

module.exports = {
    add,
    getList,
    update,
    remove
}