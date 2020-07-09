/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-07-09 16:33:02
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
    gzjh: {
        type: String
    }
}, {
    collection: 'documentNext',
    versionKey: false
});

module.exports = mongoose.model('documentNext', DocumentnextSchema);
