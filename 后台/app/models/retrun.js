/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-08-02 16:36:08
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const returnSchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    returnId: {
        type: String,
        required: true
    },
    returnDes: {
        type: String,
        required: true
    },
    returnTime: {
        type: Date,
        required: true
    }
}, {
    collection: 'return',
    versionKey: false
});

module.exports = mongoose.model('return', returnSchema);