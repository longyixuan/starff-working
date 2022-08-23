/*
 * @Author: yinxl
 * @Date: 2022-08-16 09:24:25
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-08-23 11:00:23
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SurveySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    surveyName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    endDate: {
        type: Date
    },
    user: {
        type: Array,
        required: true
    },
    option: {
        type: Array,
        required: true
    }
}, { collection: 'survey', versionKey: false});

module.exports = mongoose.model('survey', SurveySchema);
