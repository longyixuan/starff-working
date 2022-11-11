/*
 * @Author: yinxl
 * @Date: 2022-11-11 09:38:17
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-11 11:15:10
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        frwId: { //父任务
            type: String
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

        },
        jssj: { //结束时间

        },
        wcsj: { //完成时间

        },
        rwzt: { // 任务状态

        },
        rwms: { //任务描述
            type: String,
            required: true
        },
        rwlx: { //任务类型

        },
        bz: { //备注
            
        }
    },
    {
        collection: 'task',
        versionKey: false ,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('task', taskSchema);