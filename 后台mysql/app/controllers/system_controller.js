/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-07 13:51:10
 */

const System_col = require('./../models/system');
const uuidv1 = require('uuid/v1');

const addSystem = async (ctx, next) => {
  ctx.status = 200;
  const req = ctx.request.body;
  req.id = uuidv1();
  // 新增
  if (req.parentId == '0') {
    req.parentTitle = '一级系统'
  } else {
    let parent = await System_col.findOne({
      id: req.parentId
    })
    req.parentTitle = parent.title;
  }
  await System_col.create(req);
  await System_col.updateMany({
    id: req.parentId
  }, {
    isParent: true
  });
  let newSystem = await System_col.find({
    parentId: ''
  });
  if (newSystem) {
    ctx.body = {
      code: 1,
      msg: '请求成功',
      data: newSystem
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '添加失败！'
    };
  }
}
const getSystemList = async (ctx, next) => {
  const parentId = ctx.params.id;
  const system = await System_col.find({
    parentId
  }).sort({
    'sortOrder': 1
  });
  ctx.status = 200;
  ctx.body = {
    code: 1,
    msg: '请求成功',
    data: system
  }
}
const delSystem = async (ctx, next) => {
  const id = ctx.params.id;
  ctx.status = 200;
  await System_col.remove({
    id
  });
  ctx.body = {
    code: 1,
    msg: '删除成功'
  }
}
const updateSystem = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;
  ctx.body = {
    code: 1,
    msg: '请求成功',
    data: {

    }
  }
}
const editSystem = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;
  await System_col.updateOne({
    id: req.id
  }, req);
  const system = await System_col.findOne({
    id: req.id
  });
  ctx.body = {
    code: 1,
    msg: '请求成功',
    data: system
  }
}
const getAllList = async (ctx,next) => { //获取系统树
  ctx.status = 200;
  const system = await System_col.find().ne('parentId', '0');
  ctx.body = {
    code: 1,
    data: system,
    msg: '请求成功'
  }
}
const searchSystem = async (ctx,next) => {
  ctx.status = 200;
  var query = new RegExp(ctx.query.title, 'i');
  const result = await System_col.find({
      title: query
  })
  ctx.body = {
      code: 1,
      msg: '请求成功',
      data: result
  }
}
const systemTree = async (ctx,next) => {
  ctx.status = 200;
  const result = await System_col.find({
      parentId: '0'
  });
  let clone = [];
  for (let i = 0; i < result.length; i++) {
      clone.push({
          title: result[i].title,
          id: result[i].id,
          parentId: result[i].parentId,
          children: []
      })
  }
  for (let i = 0; i < clone.length; i++) {
      let children = await System_col.find({ //获取二级数据
          parentId: clone[i].id
      });
      for (let j = 0; j < children.length; j++) {
          clone[i].children.push(children[j])
      }
  }
  ctx.body = {
      code: 1,
      data: clone,
      msg: 'success'
  };
}
module.exports = {
  addSystem,
  getSystemList,
  systemTree,
  delSystem,
  updateSystem,
  editSystem,
  getAllList,
  searchSystem
}