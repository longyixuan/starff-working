/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-01-26 15:45:07
 */

const Department_col = require('./../models/department');
const uuidv1 = require('uuid/v1');

const addDepartment = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    // 新增
    if (req.parentId == '0') {
        req.parentTitle = '一级部门'
    } else {
        let parent = await Department_col.findOne({
            id: req.parentId
        })
        req.parentTitle = parent.title;
    }
    await Department_col.create(req);
    await Department_col.updateMany({
        id: req.parentId
    },{
        isParent: true
    });
    let newdepartment = await Department_col.find({parentId: ''});
    if (newdepartment) {
        ctx.body = {
            code: 1,
            msg: '请求成功',
            data: newdepartment
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '添加失败！'
        };
    }
}
const getDepartmentList = async (ctx, next) => {
    const parentId = ctx.params.id;
    const department = await Department_col.find({
        parentId
    }).sort({
        'sortOrder': 1
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: department
    }
}
const depTree = async (o, p) => { //p为父菜单节点。o为菜单列表id。
    const depList = await Department_col.find({
        parentId: o
    });
    for (let i = 0; i < depList.length; i++) {
        let t = depList[i].toObject();
        p.children.push(t);
        depTree(t.id, t);
    }
}
const delDepartment = async (ctx, next) => {
    const id = ctx.params.id;
    ctx.status = 200;
    await Department_col.remove({
        id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    }
}
const updateDepartment = async (ctx, next) => {
    const req = ctx.request.body;
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: {

        }
    }
}
const editDepartment = async (ctx,next) => {
    const req = ctx.request.body;
    ctx.status = 200;
    await Department_col.updateMany({
        id: req.id
    }, { hasReplay: true });
    const department = await Department_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: department
    }
}
const searchDepartment = async (ctx,next) => {
    ctx.status = 200;
    var query = new RegExp(ctx.query.title, 'i');
    const result = await Department_col.find({
        title: query
    })
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    }
}
module.exports = {
    addDepartment,
    getDepartmentList,
    delDepartment,
    updateDepartment,
    editDepartment,
    searchDepartment
}