/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-29 10:37:42
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const callBackSchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    commentId: {
        type: String,
        required: false
    },
    reason: {
        type: String,
        required: false
    }
}, {
    collection: 'callBack',
    versionKey: false
});

module.exports = mongoose.model('callBack', callBackSchema);
