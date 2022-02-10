/*
 * @Author: yinxl
 * @Date: 2022-02-09 09:28:42
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-02-09 16:11:29
 */

const uuidv1 = require('uuid/v1');
const Return_col = require('../models/retrun');
const add = async (ctx, next) => {
    const req = ctx.request.body;
    req.id = uuidv1();
    await Return_col.create(req);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}
const del = async (ctx, next) => {
    const req = ctx.request.body;
    await Return_col.remove({
        id: req.id
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}
module.exports = {
    add,
    del
}