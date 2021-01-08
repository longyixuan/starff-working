/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-08 13:58:36
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tagSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { collection: 'tag', versionKey: false});

module.exports = mongoose.model('tag', tagSchema);