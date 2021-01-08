/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-08 11:32:45
 */

const System_col = require('./../models/system');
const User_col = require('./../models/user');
const WorkTime_col = require('./../models/workTime');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

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
  const userList = await User_col.find({});
  let flag = false;
  userList.forEach((item) => {
     if (_.includes(item.systems,id)) {
        flag = _.includes(item.systems,id)
     }
  })
  if (flag) {
    ctx.body = {
      code: 0,
      msg: '删除失败，该系统已被应用'
    }
  } else {
    await System_col.remove({
      id
    });
    ctx.body = {
      code: 1,
      msg: '删除成功'
    }
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
  await WorkTime_col.updateMany({
    systemId: req.id
  }, {systemName: req.title});
  const system = await System_col.findOne({
    id: req.id
  });
  ctx.body = {
    code: 1,
    msg: '请求成功',
    data: system
  }
}
const treeNode = function(id,title,createdAt,updatedAt,mainHeader,viceHeader,createBy,updateBy,delFlag,isParent,parentId,parentTitle,sortOrder,status,children) {
    this.mainHeader = mainHeader;
    this.viceHeader = viceHeader;
    this.createBy = createBy;
    this.updateBy = updateBy;
    this.delFlag = delFlag;
    this.isParent = isParent;
    this.parentId = parentId;
    this.parentTitle = parentTitle;
    this.sortOrder = sortOrder;
    this.status = status;
    this.title = title;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.children = children;
}
const getDFSTree = function(data, parentId) {
  let treelist = [];
  for (let i = 0; i < data.length; i++) {
      if (data[i].parentId == parentId) {
          let tree = new treeNode(
            data[i].id,
            data[i].title,
            data[i].createdAt,
            data[i].updatedAt,
            data[i].mainHeader,
            data[i].viceHeader,
            data[i].createBy,
            data[i].updateBy,
            data[i].delFlag,
            data[i].isParent,
            data[i].parentId,
            data[i].parentTitle,
            data[i].sortOrder,
            data[i].status,
            getDFSTree(data, data[i].id));
          treelist.push(tree)
      }
  }
  return treelist;
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
  const result = await System_col.find({});
  let tree = getDFSTree(result, '0');
  ctx.body = {
      code: 1,
      data: tree,
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