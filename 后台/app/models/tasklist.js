/*
 * @Author: yinxl
 * @Date: 2022-11-11 09:38:17
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-19 18:23:17
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
        content: [
            {
                lmmc: { // 栏目名称
                    type: String,
                    required: true
                },
                ymsm: { // 页面说明
                    type: String
                },
                zt: { // 状态
                    type: String
                },
                sjsm: { // 设计说明
                    type: String
                },
                kfsm: {  // 开发说明
                    type: String
                },
                khd: []  // 终端
            }
        ],
    },
    {
        collection: 'taskList',
        versionKey: false ,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('taskList', taskListSchema);