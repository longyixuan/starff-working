/*
 * @Author: yinxl
 * @Date: 2022-11-11 09:38:17
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-01-17 11:44:24
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskLogSchema = new Schema(
    {
        id: { //任务id
            type: String,
            required: true
        },
        rwmc: { //任务名称
            type: String,
            required: true
        },
        frwId: { //父任务
            type: String,
            default: '0'
        },
        xtId: { //所属系统
            type: String,
            required: true
        },
        jbrId: { // 经办人
            type: String,
            required: true
        },
        kssj: { //开始时间
            type: Date,
            required: true
        },
        jssj: { //结束时间
            type: Date
        },
        rwzt: { // 任务状态
            type: String,
            required: true
        },
        yxj: {  //优先级
            type: Number,
            required: true,
            default: 0
        },
        jira: {
            type: String
        },
        bz: { //备注
            type: String
        },
        updateTime: {
            type: Date,
            required: true
        }
    },
    {
        collection: 'taskLog',
        versionKey: false ,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('taskLog', taskLogSchema);