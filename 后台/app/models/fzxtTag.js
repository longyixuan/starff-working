/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-25 13:41:16
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fzxtTagSchema = new Schema({
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
        required: true,
        default: 0
    }
}, { collection: 'fzxtTag', versionKey: false});

module.exports = mongoose.model('fzxtTag', fzxtTagSchema);