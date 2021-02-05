/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-02-05 17:20:06
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ImagesSchema = new Schema({
    imageId: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    systemId: {
        type: String,
        required: true
    },
    year: {
        type: Number,
    },
    order: {
        type: Number,
        default: 0
    },
    ext: {
        type: String,
        required: true
    },
    tag: {
        type: Array,
        default: []
    }
}, { collection: 'images', versionKey: false});

module.exports = mongoose.model('images', ImagesSchema);
