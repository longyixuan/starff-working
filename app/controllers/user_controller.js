/*
 * @Author: kuangxj 
 * @Email: frankxjkuang@gmail.com 
 * @Date: 2018-08-14 16:01:01 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-02 17:59:41
 * @Description: user api 
 */

const config = require('./../../config');
const passport = require('./../utils/passport');
const User_col = require('./../models/user');
const Passport_col = require('./../models/password');
const UserSystem_col = require('./../models/userSystem');
const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken'); // 用于签发、解析`token`

const get = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    msg: 'get request!!',
    data: {
      data: ctx.request.query
    }
  }
}

const post = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    msg: 'post request!!',
    data: {
      data: ctx.request.body
    }
  }
}
/* jwt密钥 */
const secret = 'secret';
/* 获取一个期限为4小时的token */
function getToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: '4h' });
}
// 登录
const login = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
  }, {
    __v: 0,
    _id: 0
  });
  if (!user) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: 'account or password error!'
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
      token: getToken({ user: req.account, password: req.password }),
      msg: 'login success',
      data: user
    }
    return;
  }

  ctx.body = {
    code: 0,
    msg: 'account or password error!'
  }
}

// 注册
const register = async (ctx, next) => {
  const req = ctx.request.body;

  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
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
  const newUser = await User_col.create({
    userId,
    account: req.account,
    userName: req.userName,
    email: req.email
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
        token: getToken({ user: req.account, password: req.password }),
        data: {
          userId: newUser.userId,
          account: newUser.account
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

// 更新个人信息
const updateUserInfo = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取用户的 userId
  const result = await User_col.updateOne({
    userId: req.userId
  }, req);
  for (let i = 0;i<req.systems.length;i++) {
    await UserSystem_col.create({
      id: uuidv1(),
      userId: req.userId,
      systemId: req.systems[i],
    });
  }
  ctx.status = 200;
  if (result.nModified == 1) {
    ctx.body = {
      code: 1,
      msg: 'save successed!'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: 'save failed!'
    }
  }
}
// 获取用户列表
const getUserList = async (ctx, next) => {
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
module.exports = {
  get,
  post,
  login,
  register,
  updateUserInfo,
  getUserList
}