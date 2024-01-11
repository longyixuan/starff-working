/*
 * @Author: yinxl 
 * @Date: 2022-11-14 09:47:05 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-08-18 10:21:31
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const iconTagSchema = new Schema({
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
}, { collection: 'iconTag', versionKey: false});

module.exports = mongoose.model('iconTag', iconTagSchema);