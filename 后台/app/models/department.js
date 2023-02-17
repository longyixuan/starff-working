/*
 * @Author: yinxl
 * @Date: 2019-04-08 11:04:00
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-17 15:22:33
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
    id: {
        type: String,
        unique: true,
        require: true
    },
    mainHeader: [],
    viceHeader: [],
    createBy: {
        type: String,
        default: null
    },
    updateBy: {
        type: String,
        default: null
    },
    delFlag: {
        type: Number,
        default: 0
    },
    isParent: {
        type: Boolean,
        default: false
    },
    parentId: {
        type: String,
        default: '',
        ref: 'department'
    },
    parentTitle: {
        type: String,
        default: ''
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: ''
    }
}, {
    collection: 'department',
    versionKey: false,
    timestamps: true
});
module.exports = mongoose.model('department', DepartmentSchema);
