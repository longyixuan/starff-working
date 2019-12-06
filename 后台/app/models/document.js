/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-06 11:51:27
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    documentId: {
        type: String,
        unique: true,
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
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    content: {
        type: String
    },
    contentHtml: {
        type: String
    },
    year: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    }
}, { collection: 'document', versionKey: false});

module.exports = mongoose.model('document', DocumentSchema);
