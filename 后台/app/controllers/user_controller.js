/*
 * @Author: yinxl 
 * @Date: 2019-04-10 18:35:47 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-07 12:35:57
 */

const config = require('./../../config');
const passport = require('./../utils/passport');
const User_col = require('./../models/user');
const Department_col = require('./../models/department');
const System_col = require('./../models/system');
const Passport_col = require('./../models/password');
const uuidv1 = require('uuid/v1');
const qs = require('qs');
const jsonwebtoken = require('jsonwebtoken')

/* jwt密钥 */
//秘钥
const jwtSecret = 'jwtSecret'
// 登录
const login = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取用户的 userId
  const user = await User_col.findOne({
    userName: req.userName
  }, {
    __v: 0,
    _id: 0
  });
  if (!user) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '用户不存在!'
    }
    return;
  }
  if (user.status===-1) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '账号已被禁用,请联系管理员!'
    }
    return;
  }
  const userId = user.userId;

  // 获取数据库中的 hash
  const pass = await Passport_col.findOne({
    userId
  }, {
    hash: 1,
  });
  const match = await passport.validate(req.password, pass.hash);
  ctx.status = 200;
  if (match) {
    //这是加密的 key（密钥）
    ctx.body = {
      code: 1,
      msg: '登录成功',
      data: user,
      token: jsonwebtoken.sign({
          data: user,
          // 设置 token 过期时间
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 60 seconds * 60 minutes = 1 hour
        }, jwtSecret)
    }
    return;
  }

  ctx.body = {
    code: 0,
    msg: '用户名或密码错误'
  }
}

// 注册
const register = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取用户的 userId
  const user = await User_col.findOne({
    userName: req.userName
  });

  ctx.status = 200;
  if (user) {
    ctx.body = {
      code: 0,
      msg: '用户名重复！'
    }
    return;
  }
  
  // 插入新用户
  const userId = uuidv1();
  if (req.userName==='admin') {
    req.type = 1; //admin账号自动注册为管理员
  }
  const newUser = await User_col.create({
    userId,
    ...req
  });

  if (newUser) {
    // 加密
    const hash = await passport.encrypt(req.password, config.saltTimes);
    const result = await Passport_col.create({
      userId: userId,
      hash
    })
    if (result) {
      ctx.body = {
        code: 1,
        msg: '注册成功！',
        data: {
          userId: newUser.userId,
          userName: newUser.userName
        }
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '注册失败！'
    };
  }
}
const getUserInfo = async (ctx, next) => {
  const token = ctx.request.headers.accesstoken;
  //解密
  jsonwebtoken.verify(token, jwtSecret, function (err, decoded) {
    if (!err) {
      const user = decoded.data;
      ctx.status = 200;
      ctx.body = {
        code: 1,
        data: user,
        msg: '用户信息获取成功'
      }
    }
  })
}
// 更新个人信息
const updateUserInfo = async (ctx, next) => {
  const req = qs.parse(ctx.request.body);
  // 获取用户的 userId
  req.systems = Object.keys(req.systems).map(key=> req.systems[key])
  const result = await User_col.updateOne({
    userId: req.userId
  }, req);
  ctx.status = 200;
  if (result.nModified == 1) {
    ctx.body = {
      code: 1,
      msg: '信息已更新'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '保存失败'
    }
  }
}
//解锁
const unLock = async (ctx,next) => {
  const req = ctx.request.body;
  const token = ctx.request.headers.accesstoken;
  //解密
  jsonwebtoken.verify(token, jwtSecret, function (err, decoded) {
    if (!err) {
      const userId = decoded.data.userId;
      // 获取数据库中的 hash
      const pass = Passport_col.findOne({
        userId
      }, {
        hash: 1,
      });

      const match = passport.validate(req.password, pass.hash);
      ctx.status = 200;
      if (match) {
        //这是加密的 key（密钥）
        ctx.body = {
          code: 1,
          msg: '登录成功'
        }
        return;
      }

      ctx.body = {
        code: 0,
        msg: '密码错误'
      }
    }
  })
}
// 获取用户列表
const getAllUser = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取用户的 userId
  const result = await User_col.find();

  ctx.status = 200;
  ctx.body = {
    code: 1,
    msg: 'select successed!',
    data: result
  }
}
const getByCondition = async (ctx, next) => {
  ctx.status = 200;
  const req = ctx.query;
  const AllByPage = await User_col.find({
    $or: [
      { userName: { $regex: req.userName }},
      { departmentId: { $regex: req.departmentId }},
      { email: { $regex: req.email }}
    ]
  })
  .limit(parseInt(req.pageSize)).skip((parseInt(req.pageNumber) - 1), parseInt(req.pageSize));
  const allPage = await User_col.find({});
  const totalElements = Math.ceil(allPage.length / parseInt(req.pageSize)); //计算页数
  ctx.body = {
    code: 1,
    msg: '获取用户列表成功',
    data: {
      content: AllByPage,
      totalElements: totalElements
    }
  }
}
const adminEdit = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;
  // 获取用户的 userId
  if(req.departmentId!='') {
    const department = await Department_col.findOne({
      id: req.departmentId
    });
    req.departmentTitle = department.title;
  }
  await User_col.updateOne({
    userId: req.userId
  }, req);
  ctx.body = {
    code: 1,
    msg: '请求成功'
  }
}
const userDisable = async (ctx, next) => {
  ctx.status = 200;
  const userid = ctx.params.id;
  await User_col.updateOne({
    userId: userid
  }, {
    status: -1
  });
  ctx.body = {
    code: 1,
    msg: '请求成功'
  }
}
const userEnable = async (ctx, next) => {
  ctx.status = 200;
  const userid = ctx.params.id;
  await User_col.updateOne({
    userId: userid
  }, {
    status: 0
  });
  ctx.body = {
    code: 1,
    msg: '请求成功'
  }
}
const delUser = async (ctx, next) => {
  ctx.status = 200;
  const userid = ctx.params.id;
  await User_col.remove({
    userId: userid
  });
  ctx.body = {
    code: 1,
    msg: '删除成功'
  }
}
const getByDepartment = async (ctx, next) => {
  ctx.status = 200;
  const departmentId = ctx.params.id;
  const result = await User_col.find({
    departmentId
  });
  ctx.body = {
    code: 1,
    data: result,
    msg: '获取部门人员成功'
  }
}
const resetPassword = async (ctx,next) => {
  const req = ctx.request.body;
  const token = ctx.request.headers.accesstoken;
  //解密
  const userId = jsonwebtoken.verify(token, jwtSecret).data.userId;
  // 获取数据库中的 hash
  const pass = await Passport_col.findOne({ //验证密码
    userId
  }, {
    hash: 1,
  });
  const match = await passport.validate(req.password, pass.hash);
  ctx.status = 200;
  if (match) {
    // 加密
    await Passport_col.deleteMany({
      userId: userId
    });
    const hash = await passport.encrypt(req.newPass, config.saltTimes);
    await Passport_col.create({
      userId: userId
    }, hash);
    await User_col.updateOne({
      userId: userId
    }, {
      passStrength: req.passStrength
    })
    if (result) {
      ctx.body = {
        code: 1,
        msg: '密码修改成功'
      }
    }
    return;
  } else {
    ctx.body = {
      code: 0,
      msg: '原密码不正确'
    }
  }
}
const userSystem = async (ctx, next) => { //首页统计功能
  ctx.status = 200;
  const req = qs.parse(ctx.request.body);
  const systems = await User_col.aggregate([
    {
      $match: {
          'userId': {
              '$in': req.userlist
          }
      }
    }
  ]);
  let result = [];
  for (let i = 0; i < systems.length; i++) {
    const element = systems[i].systems;
    result = Array.from(new Set([...result,...element]))
  }
  ctx.body = {
    code: 1,
    data: result,
    msg: '请求成功'
  }
}
module.exports = {
  login,
  register,
  updateUserInfo,
  getUserInfo,
  getAllUser,
  unLock,
  getByCondition,
  adminEdit,
  userDisable,
  userEnable,
  delUser,
  getByDepartment,
  userSystem,
  resetPassword
}