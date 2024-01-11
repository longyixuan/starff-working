/*
 * @Author: yinxl
 * @Date: 2022-07-21 13:43:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-12-22 08:54:57
 */

const Md_col = require('./../models/md');
const MdLog_col = require('./../models/mdLog');
const MdType_col = require('./../models/mdType');
const stream = require('stream');
const uuidv1 = require('uuid/v1');
const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let md = await Md_col.findOne({
        title: req.title
    });
    if (md) {
        ctx.body = {
            code: 0,
            msg: '该目录下已有内容，请返回列表中查看'
        };
    } else {
        req.id = uuidv1();
        await Md_col.create(req);
        ctx.body = {
            code: 1,
            msg: '新增成功'
        };
    }
}

const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Md_col.updateOne({
        id: req.id
    }, req);
    await MdLog_col.create(req);
    const result = await Md_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const list = async (ctx, next) => {
    const req = ctx.request.body;
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $match: {
                type: req.type
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                updateTime: '$updateTime',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                titleDes: {$arrayElemAt:["$mdType.name",0]},
                titlePid: {$arrayElemAt:["$mdType.pid",0]},
                titlePidDes: {$arrayElemAt:["$mdType.pidDes",0]},
                created_at: '$created_at',
                updated_at: '$updated_at',
                order: {$arrayElemAt:["$mdType.order",0]}
            }
        },
        {
            $sort: {
                order: 1
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    }
};

const detail = async (ctx, next) => {
    const req = ctx.request.body;
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $match: {
                id: req.id
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                titleDes: {$arrayElemAt:["$mdType.name",0]},
                mdCode: '$mdCode',
                htmlCode: '$htmlCode',
                updateTime: '$updateTime'
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result.length>0?result[0]:null
    }
};

const detailByTitle = async (ctx, next) => {
    const req = ctx.request.body;
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $match: {
                title: req.id
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                titleDes: {$arrayElemAt:["$mdType.name",0]},
                mdCode: '$mdCode',
                htmlCode: '$htmlCode',
                updateTime: '$updateTime',
                updatedAt: '$updated_at'
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result.length>0?result[0]:null
    }
};

const addType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.create({
        id: uuidv1(),
        name: req.name,
        order: req.order,
        pid: req.pid,
        pidDes: req.pidDes,
        type: req.type
    });
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.updateOne({
        id: req.id
    }, {
        name: req.name,
        order: req.order,
        pid: req.pid,
        pidDes: req.pidDes,
        type: req.type
    });
    const result = await MdType_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const delType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await MdType_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listType = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let result = await MdType_col.find({type: req.type}).sort({order: 1 });
    let tree = getDFSTree(result, '');
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: tree,
        data2: result
    };
}

const treeNode = function(id, name, order, pid, pidDes, _showChildren, children) {
    this.id = id;
    this.name = name;
    this.order = order;
    this.pid = pid;
    this.pidDes = pidDes;
    this._showChildren = _showChildren;
    this.children = children;
}

const getDFSTree = function(data, pid) {
    let treelist = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
            let tree = new treeNode(
                data[i].id,
                data[i].name,
                data[i].order,
                data[i].pid,
                data[i].pidDes,
                true,
                getDFSTree(data, data[i].id)
            );
            treelist.push(tree)
        }
    }
    return treelist;
}

const getLog = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let result = await MdLog_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $match: {
                id: req.id
            }
        },
        {
            $project: {
                _id: 0,
                user: '$user',
                title: '$title',
                id: '$id',
                updateTime: '$updateTime',
                bz: '$bz',
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                created_at: '$created_at',
                updated_at: '$updated_at'
            }
        },
        {
            $sort: {
                updated_at: -1
            }
        }
    ]);
    ctx.body = {
        code: 1,
        data: result,
        msg: '查询成功'
    };
}

const downLoad = async (ctx, next) => {
    const req = ctx.request.query;
    let result = await Md_col.aggregate([
        {
            $lookup: {
                from: "mdType",
                localField: "title",
                foreignField: "id",
                as: "mdType"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "userName",
                as: "userInfo"
            }
        },
        {
            $match: {
                type: req.type
            }
        },
        {
            $project: {
                _id: 0,
                userName: {$arrayElemAt:["$userInfo.nickName",0]},
                title: {$arrayElemAt:["$mdType.name",0]},
                code: "$mdCode"
            }
        },
        {
            $sort: {
                title: 1
            }
        },
    ]);
    let content = '';
    result.forEach( item => {
        content += '# ' + item.title + '\n' + item.code + '\n';
    });
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.attachment('设计规范汇总.md'); // 使用attachment方法设置Content-Disposition头部
    const readable = new stream.Readable(); // 创建可读流
    readable._read = () => {}; // 必须实现 _read 方法
    readable.push(content); // 将文本内容压入可读流
    readable.push(null); // 结束可读流
    ctx.status = 200;
    ctx.body = readable; // 将可读流作为响应体
}

module.exports = {
    add,
    list,
    update,
    detail,
    detailByTitle,
    addType,
    listType,
    updateType,
    delType,
    getLog,
    downLoad
}