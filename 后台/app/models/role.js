/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-08 16:27:17
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    id: {
        type: String,
        unique: true,
        require: true
    },
    dataType: {
        type: Number
    },
    defaultRole: {
        type: Boolean
    },
    delFlag: {
        type: Number
    },
    departments: [],
    description: { //描述
        type: String
    },
    name: { //名字
        type: String
    },
    permission: [], //权限
    isParent: {
        type: Boolean
    },
    parentId: {
        type: String
    },
    parentTitle: {
        type: String
    },
    sortOrder: {
        type: Number
    },
    status: {
        type: Number
    },
    title: {
        type: String
    },
    createBy: {
        type: String
    },
    updateBy: {
        type: String
    }
}, {
    collection: 'role',
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('role', RoleSchema);