/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-21 13:58:24
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const awsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    systemId: {
        type: String,
        required: true
    },
    systemName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { collection: 'aws', versionKey: false});

module.exports = mongoose.model('aws', awsSchema);