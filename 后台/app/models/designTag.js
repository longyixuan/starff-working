/*
 * @Author: yinxl 
 * @Date: 2022-09-01 17:24:10 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-09-15 19:41:56
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const designTagSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: true,
        default: 'root'
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        default: '个数'
    },
    hasDes: {
        type: Boolean,
        required: true,
        default: true
    }
}, { collection: 'designTag', versionKey: false});

module.exports = mongoose.model('designTag', designTagSchema);