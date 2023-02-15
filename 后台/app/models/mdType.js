/*
 * @Author: yinxl
 * @Date: 2023-02-09 14:37:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-13 13:55:43
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mdTypeSchema = new Schema({
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
}, { collection: 'mdType', versionKey: false});

module.exports = mongoose.model('mdType', mdTypeSchema);