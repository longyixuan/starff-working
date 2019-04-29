/*
 * @Author: yinxl 
 * @Date: 2019-04-29 11:46:46 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-29 15:13:56
 */

const WorkTime_col = require('./../models/workTime');
const System_col = require('./../models/system');
const User_col = require('./../models/user');
const uuidv1 = require('uuid/v1');
const getAll = require('./../middleware/timeHelp');
const qs = require('qs');

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
/**
 * 
 */
const workTimeSeach = async (ctx, next) => {
    ctx.status = 200;
    const req = qs.parse(ctx.request.body);
    const system = await System_col.find({
        'id': {
            '$in': req.system,
            '$exists': true
        }
    });
    const time = await WorkTime_col.aggregate([ //按系统查询
        {
            $match: {
                'userId': {
                    '$in': req.people,
                    '$exists': true
                },
                'systemId': {
                    '$in': req.system,
                    '$exists': true
                } 
            }
        },
        {
            $group: {
                _id :  { systemId: '$systemId',year: '$year',month: '$month',day: '$day',systemName: '$systemName'},
                time : { $sum : "$time" },
            }
        },
        {
            $group: {
                _id :  { systemId: '$_id.systemId',systemName: '$_id.systemName'},
                details: {
                    $push: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day',
                        time: '$time'
                    }
                }
            }
        }
    ]);
    let result = [];
    const date = getAll(req.startTime,req.endTime) //获取日期列表
    for (let i = 0; i < time.length; i++) {
        let element = time[i]._id;
        let timeList = {
            systemId: element.systemId,
            systemName: element.systemName
        };
        for (let j = 0; j < time[i].details.length; j++) {
            let element2 = time[i].details[j];
            let str = element2.year+'-'+(element2.month<10?'0'+element2.month:element2.month)+'-'+(element2.day<10?'0'+element2.day:element2.day);
            if (date.includes(str)) { //查询到数据
                timeList[str] = element2.time
            }
        }
        result.push(timeList);
    }
    ctx.body = {
        code: 1,
        data: result,
        msg: '查询成功'
    };
}
module.exports = {
    getTimeList,
    postTime,
    workTimeCount,
    workTimeSeach
}