/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:03:56 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-17 11:10:31
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MenuSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
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
    name: {
        type: String,
        default: ""
    },
    level: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 0
    },
    title: {
        type: String,
        default: ""
    },
    path: {
        type: String,
        default: ""
    },
    component: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: ""
    },
    parentId: {
        type: String,
        default: "",
        ref: "menu"
    },
    isParent: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    buttonType: {
        type: Number,
        default: ""
    },
    status: {
        type: Number,
        default: 0
    },
    url: {
        type: String,
        default: ""
    }
}, {
    collection: 'menu',
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('menu', MenuSchema);