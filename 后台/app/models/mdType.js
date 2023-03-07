/*
 * @Author: yinxl
 * @Date: 2023-02-09 14:37:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-01 17:15:44
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mdTypeSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        default: ''
    },
    pidDes: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    }
}, { collection: 'mdType', versionKey: false});

module.exports = mongoose.model('mdType', mdTypeSchema);