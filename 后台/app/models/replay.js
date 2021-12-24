/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-08-02 16:22:22
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const replaySchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    replayId: {
        type: String,
        required: true
    },
    replayDes: {
        type: String,
        required: true
    },
    replayTime: {
        type: Date,
        required: true
    }
}, {
    collection: 'replay',
    versionKey: false
});

module.exports = mongoose.model('replay', replaySchema);