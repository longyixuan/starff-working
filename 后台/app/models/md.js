/*
 * @Author: yinxl
 * @Date: 2023-02-09 14:37:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-02 18:12:48
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mdSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: ''
    },
    user: {
        type: String,
        required: true
    },
    mdCode: {
        type: String,
        required: true
    },
    htmlCode: {
        type: String,
        required: true
    }
}, { collection: 'md', versionKey: false});

module.exports = mongoose.model('md', mdSchema);