/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-16 13:49:50
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mdMonthSchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    nickName: {
        type: String
    },
    year: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    md: {
        type: String,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'WTJ'
    }
}, { collection: 'mdMonth', versionKey: false});

module.exports = mongoose.model('mdMonth', mdMonthSchema);
