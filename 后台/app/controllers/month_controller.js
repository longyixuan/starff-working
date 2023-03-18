const uuidv1 = require('uuid/v1');
const Month_col = require('./../models/mdMonth');
const User_col = require("./../models/user");
const _ = require('lodash');

const add = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const document = await Month_col.findOne({
        documentName: req.documentName,
    });
    if (document) {
        ctx.body = {
            code: 0,
            msg: '本月已有记录，请勿重新添加！'
        }
        return;
    }
    req.documentId = uuidv1();
    await Month_col.create(req)
    ctx.body = {
        code: 1,
        msg: '保存成功'
    }
}

const edit = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Month_col.findOneAndUpdate({
        documentId: req.documentId
    }, req);
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const list = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Month_col.aggregate([
        {
            $match: {
                userId: req.userId,
                year: req.year
            }
        },
        {
            $sort: {
                month: -1
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    }
}

const search = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let userList = await User_col.aggregate([
        {
            $match: {
                defaultRole: {
                    $ne: ''
                }
            }
        },
        {
            $sort: {
                order: 1
            }
        },
        {
            $group: {
                _id: {
                    departmentTitle: '$departmentTitle',
                },
                content: {
                    $push: {
                        userName: '$userName',
                        nickName: '$nickName',
                        departmentId: '$departmentId',
                        departmentTitle: '$departmentTitle'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                departmentTitle: '$_id.departmentTitle',
                list: '$content'
            }
        },
    ]);
    let temp = []; //设计一部未写总结人员
    let temp1 = []; //设计二部未写总结人员
    const result = await Month_col.aggregate([
        {
            $match: {
                userId: {
                    '$in': req.people
                },
                status: {
                    $ne: 'WTJ'
                },
                year: req.year,
                month: req.month
            }
        },
        {
            $sort: {
                userName: 1,
                month: 1
            }
        }
    ]);
    for (let i = 0; i < userList.length; i++) {
        let element = userList[i];
        for (let j = 0; j < element.list.length; j++) {
            let item = element.list[j];
            if (!_.find(result, {'userName': item.userName})) { //未写总结
                if (element.departmentTitle=="设计一部") {
                    temp.push(item.nickName)
                } else {
                    temp1.push(item.nickName)
                }
            }
        }
    }
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result,
        temp: temp,
        temp1: temp1
    }
}

const details = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Month_col.findOne({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    }
}

const commit = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Month_col.findOneAndUpdate({
        documentId: req.documentId
    }, {
        status: 'YTJ'
    });
    ctx.body = {
        code: 1,
        msg: '提交成功',
        data: result
    }
}

const del = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Month_col.deleteMany({
        documentId: req.documentId
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    }
}

const callback = async (ctx) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result = await Month_col.findOneAndUpdate({
        documentId: req.documentId
    }, {
        status: 'YTH'
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    }
}

module.exports = {
    list,
    edit,
    add,
    details,
    commit,
    del,
    callback,
    search
}