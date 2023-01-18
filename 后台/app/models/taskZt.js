/*
 * @Author: yinxl 
 * @Date: 2022-11-14 09:47:05 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-01-18 11:42:23
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
    },
    order: {
        type: Number,
        default: 0
    }
}, { collection: 'taskZt', versionKey: false});

module.exports = mongoose.model('taskZt', taskZtSchema);