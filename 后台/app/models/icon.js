/*
 * @Author: yinxl 
 * @Date: 2023-07-25 18:47:16 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-12-11 11:12:46
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const iconSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: { // 名称
        type: String,
        required: true
    },
    type: { // 类型，线性还是块状
        type: String,
        required: false,
        default: ''
    },
    code: { // 字体代码 \e6c9
        type: String,
        required: true
    },
    keywords: { // 关键词，便于搜索
        type: String,
        default: ''
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    tag: { //分类
        type: Array,
        default: []
    },
    createdTime: {
        type: Date
    },
    updateTime: {
        type: Date
    },
    userName: { // 最后更新人
        type: String
    }
}, { collection: 'icon', versionKey: false, timestamps: true});

module.exports = mongoose.model('icon', iconSchema);