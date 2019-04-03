/*
 * @Author: yinxl 
 * @Date: 2019-03-12 18:24:18 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 14:05:48
 */
const uuidv1 = require('uuid/v1');
const System_col = require('./../models/system');
const searchSystemByName = async (ctx, next) => {
  const req = ctx.request.body;
  const system = await System_col.findOne({
    name: req.name
  });
  ctx.status = 200;
  if (system) {
    ctx.body = {
      code: 0,
      msg: '系统名称重复！'
    }
    return;
  }
  // 新增系统
  const id = uuidv1();
  
  const newSystem = await System_col.create({
    id,
    name: req.name
  });
  if (newSystem) {
    ctx.body = {
      code: 1,
      msg: '添加成功！',
      data: {
        id: newSystem.id,
        name: newSystem.name
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '添加失败！'
    };
  }
}
const getSystemList = async (ctx, next) => { //查询
  const systemList = await System_col.find({});
  ctx.body = {
    code: 1,
    msg: '查询成功',
    data: systemList
  };
}
module.exports = {
  searchSystemByName,
  getSystemList
}