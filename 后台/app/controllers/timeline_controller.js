/*
 * @Author: yinxl 
 * @Date: 2021-01-04 15:19:32 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-07-13 08:54:57
 */

const Timeline_col = require('./../models/timeline');
const Tag_col = require('./../models/tag');
const System_col = require('./../models/system');
const User_col = require("./../models/user");
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timelineId = uuidv1();
    req.timeStamp = new Date(req.time);
    await Timeline_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}
const remove = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Timeline_col.updateOne({
        timelineId: req.id
    },{
        islock: true
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.timeStamp = new Date(req.time);
    await Timeline_col.updateOne({
        timelineId: req.id
    }, req);
    const result = await Timeline_col.findOne({
        timelineId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}
const getList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachConfig = {
        islock: false
    };
    if (req.pt) {
        let list = [];
        const system = await System_col.find({
            parentId: req.pt
        }).sort({
            'sortOrder': 1
        });
        system.forEach(item => {
            list.push(item.id);
        })
        if (list.length>0) {
            req.system = list;
        }
    }
    if (req.system) {
        seachConfig.systemId = {
            '$in': req.system
        }
    }
    if (req.tag) {
        seachConfig.tag = req.tag
    }
    if (req.year) {
        seachConfig.time = {
            "$regex": req.year
        }
    }
    if (req.keyword) {
        let regexp=new RegExp(req.keyword,'i')
        seachConfig.description = {
            "$regex": regexp
        }
    }
    if (req.type != 1) {
        seachConfig.userName = req.userName;
    } else {
        if (req.departmentId) {
            let userList = await User_col.find({
                departmentId: req.departmentId
            });
            let temp = [];
            userList.forEach(element => {
                temp.push(element.nickName);
            });
            seachConfig.userName = {
                "$in": temp
            }
        }
    }
    let result = await Timeline_col.aggregate([{
        $match: seachConfig
    }]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
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

const lock = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    ctx.body = {
        code: 1,
        msg: '新增成功',
        data: seachList
    };
}

const getDetail = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Timeline_col.findOne({'timelineId':req.id});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const addTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Tag_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tag_col.updateOne({
        id: req.id
    }, req);
    const result = await Tag_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const removeTag = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Tag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listTag = async (ctx, next) => {
    ctx.status = 200;
    let result = await Tag_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    remove,
    update,
    getList,
    exportExcel,
    lock,
    getDetail,
    addTag,
    updateTag,
    removeTag,
    listTag
}