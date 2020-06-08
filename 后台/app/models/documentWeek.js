/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-05 17:50:43
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentWeekSchema = new Schema({
    documentId: {
        type: String,
        required: true
    },
    documentName: {
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
    year: {
        type: String,
        required: true
    },
    startDay: {
        type: Date,
        required: true
    },
    endDay: {
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
    contentTitle: {
        type: String,
        required: true
    },
    contentDescription: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        defaultValue: false
    }
}, { collection: 'documentWeek', versionKey: false});

module.exports = mongoose.model('documentWeek', DocumentWeekSchema);
