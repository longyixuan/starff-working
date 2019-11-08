/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by:   yinxl 
 * @Last Modified time: 2019-04-10 13:40:39 
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PasswordSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
}, { collection: 'password', versionKey: false});

module.exports = mongoose.model('password', PasswordSchema);
