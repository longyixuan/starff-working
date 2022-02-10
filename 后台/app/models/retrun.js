/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-02-09 15:25:05
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const returnSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    documentId: {
        type: String,
        required: true
    },
    returnDes: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true,
        default: ''
    }
}, {
    collection: 'return',
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('return', returnSchema);