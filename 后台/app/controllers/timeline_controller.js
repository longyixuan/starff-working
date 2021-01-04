/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-04 15:32:24
 */

const Timeline_col = require('./../models/timeline');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}
const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}
const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}

const exportExcel = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}

module.exports = {
    add,
    remove,
    update,
    getList,
    exportExcel
}