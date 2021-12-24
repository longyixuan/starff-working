/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-04-26 08:38:59
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LinkSchema = new Schema({
    level: {
        type: Number
    },
    parentUrl: {
        type: String
    },
    href: {
        type: String,
        required: true,
        default: ''
    },
    text: {
        type: String
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    result: {
        type: String
    },
    code: {
        type: Number,
        required: true,
        default: 0
    }
}, { collection: 'link', versionKey: false});

module.exports = mongoose.model('link', LinkSchema);
