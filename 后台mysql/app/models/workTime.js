/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:12:52 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-06-04 16:28:34
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
    type: Number,
    default: 1992
  },
  month: {
    type: Number,
    default: 9,
  },
  day: {
    type: Number,
    default: 10
  },
  timeDate: {
    type: Date
  },
  time: {
    type: Number,
    default: 8
  },
  userId: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  systemId: {
    type: String,
    default: ''
  },
  systemName: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
}, {
  collection: 'time',
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('worktime', WorkTimeSchema);