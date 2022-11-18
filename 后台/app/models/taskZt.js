/*
 * @Author: yinxl 
 * @Date: 2022-11-14 09:47:05 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-14 10:32:32
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskZtSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { collection: 'taskZt', versionKey: false});

module.exports = mongoose.model('taskZt', taskZtSchema);