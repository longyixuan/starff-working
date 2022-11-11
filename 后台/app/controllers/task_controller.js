/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:40:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-11 13:45:10
 */

const Task_col = require('./../models/task');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Task_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachConfig = {};
    if (req.userType == '0') {
        seachConfig.userName = req.userName;
    }
    if (req.system) {
        seachConfig.systemId = {
            '$in': req.system
        }
    }
    if (req.year) {
        seachConfig.time = {
            "$regex": req.year
        }
    }
    if (req.keyword) {
        let regexp=new RegExp(req.keyword,'i')
        seachConfig.des = {
            "$regex": regexp
        }
    }
    let result = await Task_col.aggregate([{
        $match: seachConfig
    }]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timeStamp = new Date(req.time);
    await Task_col.updateOne({
        id: req.id
    }, req);
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