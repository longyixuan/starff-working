/*
 * @Author: kuangxj 
 * @Email: frankxjkuang@gmail.com 
 * @Date: 2018-08-14 16:01:38 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-26 16:57:01
 * @Description: user collection
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    require: true
  },
  account: {
    type: String
  },
  userName: {
    type: String
  },
  email: {
    type: String
  },
  collections: {
    type: Array
  }
}, { collection: 'user', versionKey: false});

module.exports = mongoose.model('user', UserSchema);
