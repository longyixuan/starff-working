/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-05 15:55:55
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentdaySchema = new Schema({
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
    systemId: {
        type: String,
        required: true
    },
    systemName: {
        type: String,
        required: true
    },
    contentTitle: {
        type: String,
        required: true
    },
    contentDescription: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        defaultValue: 0
    },
    status: {
        type: Boolean,
        defaultValue: false
    }
}, { collection: 'documentDay', versionKey: false});

module.exports = mongoose.model('documentDay', DocumentdaySchema);
