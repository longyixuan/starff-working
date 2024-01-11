/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2024-01-09 11:24:35
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jkptTagSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
}, { collection: 'jkptTag', versionKey: false});

module.exports = mongoose.model('jkptTag', jkptTagSchema);