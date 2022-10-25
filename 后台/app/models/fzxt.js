/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-25 15:46:40
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fzxtSchema = new Schema({
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
    ga: {
        type: String
    },
    kfbm: {
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
    pt: {
        type: String
    }
}, { collection: 'fzxt', versionKey: false});

module.exports = mongoose.model('fzxt', fzxtSchema);