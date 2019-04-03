/*
 * @Author: yinxl 
 * @Date: 2019-03-12 18:08:34 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 11:33:35
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const systemSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    require: true
  }
},{ collection: 'system', versionKey: false });

module.exports = mongoose.model('system', systemSchema);