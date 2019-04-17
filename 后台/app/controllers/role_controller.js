/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-12 23:01:37
 */

const uuidv1 = require('uuid/v1');
const Role_col = require('./../models/role');
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = 'jwtSecret';
const addRole = async (ctx, next) => {
    const token = ctx.request.headers.accesstoken;
    //解密
    let createBy = '';
    jsonwebtoken.verify(token, jwtSecret, function (err, decoded) {
        if (!err) {
            createBy = decoded.data.userName;
        }
    })
    const req = ctx.request.body;
    const Role = await Role_col.findOne({
        name: req.name
    });
    ctx.status = 200;
    if (Role) {
        ctx.body = {
            code: 0,
            msg: '角色名称重复！'
        }
        return;
    }
    // 新增系统
    const id = uuidv1();

    const newRole = await Role_col.create(Object.assign(req, {
        id,
        createBy
    }));
    if (newRole) {
        ctx.body = {
            code: 1,
            msg: '添加成功！',
            data: req
        };
    } else {
        ctx.body = {
            code: 0,
            msg: '添加失败！'
        };
    }
}
const getAllByPage = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.query;
    const AllByPage = await Role_col.find({})
    .sort({
        'createdAt': 1
    }).limit(parseInt(req.pageSize)).skip((parseInt(req.pageNumber) - 1), parseInt(req.pageSize));
    const allPage = await Role_col.find({});
    const totalElements = Math.ceil(allPage.length / parseInt(req.pageSize)); //计算页数
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: {
            content: AllByPage,
            totalElements: totalElements
        }
    }
}
const getAllList = async (ctx, next) => {
    ctx.status = 200;
    const AllByPage = await Role_col.find({});
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: AllByPage
    }
}

const delRole = async (ctx, next) => {
    ctx.status = 200;
    const ids = ctx.params.id.split(',');
    ctx.status = 200;
    await Role_col.remove({
        id: {
            $in: ids
        }
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    }
}
module.exports = {
    addRole,
    getAllByPage,
    getAllList,
    delRole
}