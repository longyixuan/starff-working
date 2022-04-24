/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-19 20:22:47
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jiraCountSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {

    },
}, { collection: 'jiraCount', versionKey: false});

module.exports = mongoose.model('jiraCount', jiraCountSchema);