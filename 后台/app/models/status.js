/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-03-29 17:34:07
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const statusSchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    status: { //已退回0，已修正1
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    collection: 'status',
    versionKey: false
});

module.exports = mongoose.model('status', statusSchema);
