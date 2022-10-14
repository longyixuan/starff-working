/*
 * @Author: yinxl
 * @Date: 2022-08-16 09:24:25
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-14 10:12:33
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const VoteSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    voteName: {
        type: String,
        required: true
    },
    voteDes: {
        type: String
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    voteMin: {
        type: Number,
        required: true,
        default: 0
    },
    voteMax: {
        type: Number,
        required: true,
        default: 10
    }
}, { collection: 'vote', versionKey: false});

module.exports = mongoose.model('vote', VoteSchema);
