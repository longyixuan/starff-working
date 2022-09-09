/*
 * @Author: yinxl 
 * @Date: 2022-09-01 17:24:10 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-09-02 12:50:56
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const designSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    tagId: {
        type: String,
        required: true
    },
    tagNum: {
        type: Number
    },
    tagDes: {
        type: String
    }
}, { collection: 'design', versionKey: false, timestamps: true});

module.exports = mongoose.model('design', designSchema);