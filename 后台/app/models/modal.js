/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-11 08:42:42
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ModalSchema = new Schema({
    modalId: {
        type: String,
        required: true
    },
    modalName: {
        type: String,
        required: true
    },
    systemId: {
        type: String,
        required: true
    }
}, { collection: 'modal', versionKey: false});

module.exports = mongoose.model('modal', ModalSchema);
