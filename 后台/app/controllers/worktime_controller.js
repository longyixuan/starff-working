/*
 * @Author: yinxl 
 * @Date: 2019-04-29 11:46:46 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-06 19:14:02
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
                    timeDate: new Date(list[i].year + '-' + (list[i].month>9?list[i].month:'0'+list[i].month) + '-' + (list[i].day>9?list[i].day:'0'+list[i].day))
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
    const systemCount = await System_col.find().ne('parentId', '0').count();
    const weekCount = await WorkTime_col.aggregate([{
        $match: {
            year: (new Date).getFullYear(),
            month: (new Date).getMonth()
        }
    },
    {
        $group: {
            _id :  { year: '$year',month: '$month'},
            time : { $sum : "$time" },
        }
    }]);
    const monthCount = await WorkTime_col.aggregate([{
        $match: {
            year: (new Date).getFullYear(),
            month: (new Date).getMonth()+1
        }
    },{
        $group: {
            _id :  { year: '$year',month: '$month'},
            time : { $sum : "$time" },
        }
    }]);
    const yearCount = await WorkTime_col.aggregate([{
        $match: {
            year: (new Date).getFullYear()
        }
    },{
        $group: {
            _id :  { year: '$year'},
            time : { $sum : "$time" },
        }
    }]);
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: {
            systemCount: systemCount,
            weekCount: weekCount.length>0?weekCount[0].time:0,
            monthCount: monthCount.length>0?monthCount[0].time:0,
            yearCount: yearCount.length>0?yearCount[0].time:0
        }
    };
}
/**
 * 
 */
const workTimeSeach = async (ctx, next) => {
    ctx.status = 200;
    const req = qs.parse(ctx.request.body);
    const time = await WorkTime_col.aggregate([ //按系统查询
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'systemId': {
                    '$in': Object.keys(req.system).map(key=> req.system[key])
                },
                'timeDate': {
                    $gte: new Date(req.startTime),
                    $lte: new Date(req.endTime)
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
const getMapTime = async (ctx, next) => {
    ctx.status = 200;
    const req = qs.parse(ctx.request.body);
    const system = await System_col.find({
        'id': {
            '$in': Array.from(req.system)
        }
    });
    const time = await WorkTime_col.aggregate([ //按系统查询
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'systemId': {
                    '$in': Object.keys(req.system).map(key=> req.system[key])
                },
                'timeDate': {
                    $gte: new Date(req.startTime),
                    $lte: new Date(req.endTime)
                }
            }
        },
        {
            $group: {
                _id :  { systemId: '$systemId', systemName: '$systemName'},
                time : { $sum : "$time" }
            }
        },
        {
            $sort: {
                time: -1
            }
        }
    ]);
    ctx.body = {
        code: 1,
        data: time,
        system: system,
        msg: '查询成功'
    };
}
module.exports = {
    getTimeList,
    postTime,
    workTimeCount,
    workTimeSeach,
    getMapTime
}