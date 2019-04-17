/*
 * @Author: yinxl 
 * @Date: 2019-04-07 18:51:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-14 19:10:25
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    require: true
  },
  defaultRole: {
    type: String,
    default: ''
  },
  delFlag: {
    type: Number,
    default: 0
  },
  departmentId: {
    type: String,
    default: ''
  },
  departmentTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  passStrength: {
    type: String,
    default: ''
  },
  permissions: [],
  roles: [],
  userName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'http://img.exrick.cn/ac52e823491a4899af0fe114dbd21607.jpg'
  },
  nickName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  systems: [],
  status: {
    type: Number,
    default: 0,
  },
  type: {
    type: Number,
    default: 0
  }
}, {
  collection: 'user',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('user', UserSchema);