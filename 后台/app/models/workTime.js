/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:12:52 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 13:31:10
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkTimeSchema = new Schema({
    id: {
      type: String,
      unique: true,
      require: true
    },
    year: {
      type: String,
      require: true
    },
    month: {
      type: String,
      require: true
    },
    day: {
      type: String,
      require: true
    },
    time: {
      type: Number,
      require: true
    },
    userId: {
      type: String,
      require: true,
      ref: 'user'
    },
    userName: {
      type: String
    },
    systemId: {
      type: String,
      require: true,
      ref: 'system'
    },
    systemName: {
      type: String
    }
  }, { collection: 'time', versionKey: false, timestamps: true});
  
  module.exports = mongoose.model('worktime', WorkTimeSchema);