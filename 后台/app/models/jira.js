/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-24 10:24:00
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jiraSchema = new Schema({
    jiraId: {
        type: String,
        required: true
    },
    userName: { //姓名
        type: String,
        required: true
    },
    year: { // 年份
        type: String,
        required: true
    },
    month: { //月份
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    bug: {
        type: Number,
        required: true,
        default: 0
    },
    total1: { // 未完成
        type: Number,
        required: true,
        default: 0
    },
    bug1: { // 未完成
        type: Number,
        required: true,
        default: 0
    }
}, { collection: 'jira', versionKey: false});

module.exports = mongoose.model('jira', jiraSchema);