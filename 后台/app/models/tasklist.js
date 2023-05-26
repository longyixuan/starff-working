/*
 * @Author: yinxl
 * @Date: 2022-11-11 09:38:17
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-24 18:39:21
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskListSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        name: { // 任务清单名称
            type: String,
            required: true
        },
        list: {
            type: Array,
            required: true,
            default: []
        }
    },
    {
        collection: 'taskList',
        versionKey: false ,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('taskList', taskListSchema);