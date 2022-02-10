/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-01-28 13:40:24
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replaySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    documentId: {
        type: String,
        required: true
    },
    fsrId: {
        type: String,
        required: true
    },
    sjrId: {
        type: String,
        required: true
    },
    replayDes: {
        type: String,
        required: true
    },
    hasReplay: {
        type: Boolean,
        require: true,
        default: false
    },
    type: {
        type: String,
        required: true,
        default: ''
    },
    replayTime: {
        type: String,
        required: true
    }
}, {
    collection: 'replay',
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('replay', replaySchema);