/*
 * @Author: yinxl 
 * @Date: 2022-01-26 11:19:49 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-02-09 15:29:37
 */

const uuidv1 = require('uuid/v1');
const moment = require('moment');
const Replay_col = require('./../models/replay');
const addReplay = async (ctx, next) => {
    const req = ctx.request.body;
    req.id = uuidv1();
    req.replayTime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Replay_col.create(req);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}
const updateReplay = async (ctx, next) => {
    const req = ctx.request.body;
    await Replay_col.updateMany({
        id: req.id
    }, { hasReplay: true });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功'
    }
}
const getReplayList = async (ctx, next) => {
    const req = ctx.request.body;
    let seachConfig = {};
    if (req.replayId) {
        seachConfig.replayId = req.replayId
    }
    if (req.fsrId) {
        seachConfig.fsrId = req.fsrId
    }
    if (req.documentId) {
        seachConfig.documentId = req.documentId
    }
    if (req.sjrId) {
        seachConfig.sjrId = req.sjrId
    }
    if (req.replayTime) {
        seachConfig.replayTime = req.replayTime
    }
    const ydxx = await Replay_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "fsrId",
                foreignField: "userId",
                as: "fsr"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "sjrId",
                foreignField: "userId",
                as: "sjr"
            }
        },
        {
            $match: { hasReplay: true, ...seachConfig }
        },
        {
            $project: {
                _id: 0,
                id: "$id",
                documentId: "$documentId",
                hasReplay: "$hasReplay",
                replayDes: "$replayDes",
                replayTime: "$replayTime",
                type: "$type",
                fsr: {$arrayElemAt:["$fsr.nickName",0]},
                sjr: {$arrayElemAt:["$sjr.nickName",0]}
            }
        },
    ]);
    const wdxx = await Replay_col.aggregate([
        {
            $lookup: {
                from: "user",
                localField: "fsrId",
                foreignField: "userId",
                as: "fsr"
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "sjrId",
                foreignField: "userId",
                as: "sjr"
            }
        },
        {
            $match: { hasReplay: false, ...seachConfig }
        },
        {
            $project: {
                _id: 0,
                id: "$id",
                documentId: "$documentId",
                hasReplay: "$hasReplay",
                replayDes: "$replayDes",
                replayTime: "$replayTime",
                type: "$type",
                fsr: {$arrayElemAt:["$fsr.nickName",0]},
                sjr: {$arrayElemAt:["$sjr.nickName",0]}
            }
        },
    ]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: {
            ydxx: ydxx,
            wdxx: wdxx
        }
    }
}
module.exports = {
    addReplay,
    updateReplay,
    getReplayList
}