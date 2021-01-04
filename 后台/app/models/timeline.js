/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-04 15:33:14
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
    systemId: {
        type: String,
        required: true
    },
    systemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    updateBy: {

    },
    tags: {
        type: Array,
        default: []
    }
}, { collection: 'timeline', versionKey: false});

module.exports = mongoose.model('timeline', TimelineSchema);