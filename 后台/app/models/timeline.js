/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-17 09:45:32
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TimelineSchema = new Schema({
    timelineId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
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
    model: {
        type: Array,
        required: true,
        default: []
    },
    description: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    updateUser: {
        type: String,
        default: ''
    },
    tag: {
        type: String,
        default: ''
    },
    islock: {
        type: Boolean,
        default: false
    }
}, { collection: 'timeline', versionKey: false});

module.exports = mongoose.model('timeline', TimelineSchema);