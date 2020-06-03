/*
 * @Author: yinxl 
 * @Date: 2019-04-10 13:40:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-02 17:52:34
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ModalSchema = new Schema({
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
