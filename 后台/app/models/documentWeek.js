/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-05-28 17:16:19
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentdaySchema = new Schema({
    documentId: {
        type: String,
        unique: true,
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    nickName: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    year: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    templateList: [
        {
            systemId: String,
            systemName: String,
            content: [
                {
                    contentTitle: String,
                    contentDescription: String
                }
            ]
        }
    ]
}, { collection: 'documentDay', versionKey: false});

module.exports = mongoose.model('documentDay', DocumentdaySchema);
