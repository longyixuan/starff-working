/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-29 10:30:04
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentnextSchema = new Schema({
    documentId: {
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
    systemName: {
        type: String,
        required: true
    },
    systemId: {
        type: String,
        required: true
    },
    gzjh: {
        type: String,
        required: true
    }
}, {
    collection: 'documentNext',
    versionKey: false
});

module.exports = mongoose.model('documentNext', DocumentnextSchema);
