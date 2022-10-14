/*
 * @Author: yinxl
 * @Date: 2022-08-16 09:24:25
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-14 10:14:18
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
    voteUser:{
        type: Array,
        default: []
    },
    option: {
        type: Array,
        required: true
    }
}, { collection: 'survey', versionKey: false});

module.exports = mongoose.model('survey', SurveySchema);
