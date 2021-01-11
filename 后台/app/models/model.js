/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-11 17:19:41
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ModelSchema = new Schema({
    modelId: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    systemId: {
        type: String,
        required: true
    }
}, { collection: 'model', versionKey: false});

module.exports = mongoose.model('model', ModelSchema);
