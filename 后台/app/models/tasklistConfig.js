/*
 * @Author: yinxl 
 * @Date: 2022-11-14 09:47:05 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-19 15:53:50
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tasklistConfigSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { collection: 'tasklistConfig', versionKey: false});

module.exports = mongoose.model('tasklistConfig', tasklistConfigSchema);