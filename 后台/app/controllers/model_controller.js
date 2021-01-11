const Model_col = require('./../models/model');
const System_col = require('./../models/system');
const uuidv1 = require('uuid/v1');

const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    // const system = await System_col.find().ne('parentId', '0');
    // var insertList = [];
    // system.forEach(item => {
    //     item.modal.forEach(item2 => {
    //         insertList.push({
    //             modelId:uuidv1(),
    //             systemId: item.id,
    //             modelName: item2
    //         });
    //     });
    // });
    req.modelId = uuidv1();
    await Model_col.create(insertList);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}
const update = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Model_col.updateOne({
        modelId: req.id
    }, req);
    const result = await Model_col.findOne({
        modelId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}
const del = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Model_col.deleteMany({
        modelId: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}
const getlist = async (ctx, next) => {
    ctx.status = 200;
    let result = await Model_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    add,
    update,
    del,
    getlist
}