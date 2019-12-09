/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-09 14:36:25
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TemplateSchema = new Schema({
    templateId: {
        type: String,
        unique: true,
        required: true
    },
    templateName: {
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
    ],
    templateList2: [
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
}, { collection: 'template', versionKey: false});

module.exports = mongoose.model('template', TemplateSchema);
