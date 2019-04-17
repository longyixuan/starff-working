/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:06:49 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-15 15:27:09
 */

const WorkTime_col = require('./../models/workTime');
const System_col = require('./../models/system');
const User_col = require('./../models/user');
const uuidv1 = require('uuid/v1');

const getTimeList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let seachList = [];
    const mysystemList = await User_col.findOne({
        userId: req.userId
    });
    const systemList = await System_col.find({
        'id': {
            $in: mysystemList.systems
        }
    }).ne('parentId', '0');
    for (let i = 0;i<systemList.length;i++) {
        let query = {
            'systemId': systemList[i].id,
            'systemName': systemList[i].title,
            'userId': req.userId,
            'year': parseInt(req.year),
            'month': parseInt(req.month)
        }
        let timeArray = await WorkTime_col.aggregate([
            { $match: query},
            {$project:{day: '$day', duration:'$time',_id:0 }}
        ])
        seachList.push({
            'systemId': query.systemId,
            'systemName': query.systemName,
            'userId': query.userId,
            'year': query.year,
            'month': query.month,
            'timeList': timeArray
        });
    }
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: seachList
    };
}

const postTime = async (ctx, next) => { //更新工时
    ctx.status = 200;
    const req = ctx.request.body;
    let list = JSON.parse(req.data);
    for(let i = 0; i<list.length;i++) {
        let time = await WorkTime_col.findOne({
            'systemId': list[i].systemId,
            'userId': list[i].userId,
            'year': list[i].year,
            'month': list[i].month,
            'day': list[i].day
        });
        if (time) { //更新
            await WorkTime_col.updateOne({
                'systemId': list[i].systemId,
                'userId': list[i].userId,
                'year': list[i].year,
                'month': list[i].month,
                'day': list[i].day
            },{
                time: list[i].time
            });
        } else { //新增加
            await WorkTime_col.create({
                ...list[i],
                ...{
                    id: uuidv1(),
                    timeDate: new Date(list[i].year + '-' + list[i].month + '-' + list[i].day)
                }
            });
        }
    }
    const workTimeList = await WorkTime_col.find({
        systemId: req.systemId,
        userId: req.userId,
        year: req.year,
        month: req.month
    })
    ctx.body = {
        code: 1,
        msg: '保存成功',
        data: workTimeList
    };
}
const workTimeCount = async (ctx,next) => {
    ctx.status = 200;
    const req = ctx.query;
    const mysystemList = await User_col.findOne({
        userId: req.userId
    });
    const systemList = await System_col.find({
        'id': {
            $in: mysystemList.systems
        }
    }).ne('parentId', '0');
    let result = [];
    let resultTitle = [];
    for (let i = 0; i < systemList.length;i++) {
        let system = await WorkTime_col.aggregate([{
            $match: {
                userId: req.userId,
                timeDate: {
                    $gte: new Date(req.beginTime),
                    $lte: new Date(req.endTime)
                },
                systemId: systemList[i].id,
                parentId: {
                    $ne: '0'
                }
            }
        },{
            $project: {
                total: {
                    $sum: '$time'
                }
            }
        }]);
        resultTitle.push(systemList[i].title)
        result.push({
            name: systemList[i].title,
            value: system.length > 0 ? system[0].total : 0
        })
    }
    
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: {
            title: resultTitle,
            content: result
        }
    };
}
module.exports = {
    getTimeList,
    postTime,
    workTimeCount
}