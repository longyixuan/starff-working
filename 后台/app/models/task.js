/*
 * @Author: yinxl
 * @Date: 2022-11-11 09:38:17
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-14 16:04:57
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskSchema = new Schema(
    {
        id: {
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
            type: Date,
            required: true
        },
        wcsj: { //完成时间
            type: Date
        },
        rwzt: { // 任务状态，未开始，进行中，已完成
            type: String,
            required: true
        },
        yxj: {  //优先级
            type: String,
            required: true,
            default: 0
        },
        rwlx: { //任务类型，bug，任务
            type: String,
            required: true
        },
        jira: {
            type: String
        },
        bz: { //备注
            type: String
        },
        rwjz: {
            type: String
        },
        isHistory: { //是否归档
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        collection: 'task',
        versionKey: false ,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('task', taskSchema);