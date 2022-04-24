/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-18 16:34:17
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SysTimelineSchema = new Schema({
    timelineId: {
        type: String,
        required: true
    },
    sqsj: {
        type: String,
        required: false
    },
    sqsjStamp: {
        type: Date,
        required: false
    },
    publishTime: { //同步时间
        type: String,
        required: false
    },
    publishTimeStamp: { //同步时间戳
        type: Date,
        required: false
    },
    systemId: { //系统id
        type: String,
        required: true
    },
    systemName: {  //系统名称
        type: String,
        required: true
    },
    jira: { //jira
        type: String,
        default: ''
    },
    bz: { //备注
        type: String,
        default: ''
    },
    applyTime: { // 批准同步时间
        type: String,
        required: false,
        default: ''
    },
    applyStatus: { // 批准同步状态
        type: Boolean,
        default: false
    },
    commitTime: { // 已上报时间
        type: String,
        required: false,
        default: ''
    },
    commitStatus: { // 已上报状态
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        default: ''
    },
    islock: { //删除
        type: Boolean,
        default: false
    }
}, { collection: 'systimeline', versionKey: false});

module.exports = mongoose.model('systimeline', SysTimelineSchema);