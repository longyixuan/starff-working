/*
 * @Author: yinxl
 * @Date: 2023-02-09 14:37:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-10 16:34:30
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
    },
    updateTime: {
        type: String,
        required: false
    }
}, {
    collection: 'md',
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

module.exports = mongoose.model('md', mdSchema);