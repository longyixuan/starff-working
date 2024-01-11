/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2024-01-10 13:44:59
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jkptSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    xtmc: {
        type: String,
        required: true
    },
    wz: {
        type: String
    },
    bz: {
        type: String
    },
    kfbm: {
        type: Array
    },
    sjbm: {
        type: Array
    },
    qd: {
        type: Array
    },
    sj: {
        type: Array
    },
    flag: {
        type: Boolean,
        required: true,
        default: false
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    pt: {
        type: String
    }
}, { collection: 'jkpt', versionKey: false});

module.exports = mongoose.model('jkpt', jkptSchema);