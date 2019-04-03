/*
 * @Author: yinxl 
 * @Date: 2019-03-26 18:14:53 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-29 15:27:02
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const usersystemSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true
  },
  userId: {
    type: String,
    require: true
  },
  systemId: {
    type: String,
    require: true
  }
},{ versionKey: false, timestamps: true});

module.exports = mongoose.model('userAndSystem', usersystemSchema);