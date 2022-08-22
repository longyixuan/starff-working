/*
 * @Author: yinxl
 * @Date: 2022-08-16 09:24:25
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-08-22 09:42:57
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SurveyResultSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    surveyId: {
        type: String,
        required: true
    },
    option: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    }
}, { collection: 'surveyResult', versionKey: false});

module.exports = mongoose.model('surveyResult', SurveyResultSchema);
