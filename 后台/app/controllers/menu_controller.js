/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-17 14:38:07
 */

const uuidv1 = require('uuid/v1');
const Menu_col = require('./../models/menu');

const addmenu = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    // 新增
    if (req.parentId == '0') {
        req.parentTitle = '一级部门'
    } else {
        let parent = await Menu_col.findOne({
            id: req.parentId
        })
        req.parentTitle = parent.title;
    }
    await Menu_col.create(req);
    await Menu_col.updateMany({
        id: req.parentId
    }, {
        isParent: true
    });
    let newMenu = await Menu_col.find({
        parentId: ''
    });
    if (newMenu) {
        ctx.body = {
            code: 1,
            msg: '菜单创建成功',
            data: newMenu
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '菜单添加失败！'
        };
    }
}
const getMenuList = async (ctx, next) => {
    const menuList = await Menu_col.find({});
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: menuList
    }
}
const getAllList = async (ctx, next) => {
    const menuList = await Menu_col.find({});
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: menuList
    }   
}
const delmenu = async (ctx, next) => {
    const req = ctx.params;
    ctx.status = 200;
    await Menu_col.deleteMany({
        id: {
            $in: req.id.split(',')
        }
    })
    console.log(req.id.split(','))
    ctx.body = {
        code: 1,
        msg: '删除成功'
    }
}
const editmenu = async (ctx, next) => {
    const req = ctx.request.body;
    ctx.status = 200;
    await Menu_col.deleteMany({
        id: req.id
    })
    // 新增系统
    let newMenu = null;
    const id = uuidv1();
    if (!!req.parentId) { //是子菜单
        newMenu = await Menu_col.update({
            id: req.parentId
        }, {
            $push: {
                children: Object.assign(req, {
                    id: id
                })
            }
        }, {
            upsert: true,
            multi: true
        })
    } else { //一级菜单
        newMenu = await Menu_col.create(Object.assign(req, {
            id
        }));
    }
    if (newMenu) {
        ctx.body = {
            code: 1,
            msg: '请求成功',
            data: req
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '添加失败！'
        };
    }
}
module.exports = {
    addmenu,
    getMenuList,
    getAllList,
    editmenu,
    delmenu
}