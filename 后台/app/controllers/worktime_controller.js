/*
 * @Author: yinxl 
 * @Date: 2019-04-29 11:46:46 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-07 18:29:28
 */

const WorkTime_col = require('./../models/workTime');
const System_col = require('./../models/system');
const User_col = require('./../models/user');
const Role_col = require('./../models/role');
const Menu_col = require('./../models/menu');
const Department_col = require('./../models/department');
const Passport_col = require('./../models/password');
const uuidv1 = require('uuid/v1');
const getAll = require('./../middleware/timeHelp');
const qs = require('qs');
const fs = require('fs');
const JSZip = require('jszip');
const { out } = require('../../logger');
// const sendMail = require('../../mailer')

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
const resetTime = async(ctx, next) => {
    ctx.status = 200;
    const list = await WorkTime_col.find();
    out.info('重置工时');
    for (let i = 0; i < list.length; i++) {
        if (list[i].time===0 || list[i].time===null) {
            await WorkTime_col.deleteOne({
                'id': list[i].id
            })
        } else {
            await WorkTime_col.updateOne({
                'id': list[i].id
            }, {
                timeDate: new Date(list[i].timeDate)
            });
        }
    }
    ctx.body = {
        code: 1,
        msg: '重置成功'
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
            if (list[i].time===0) { //删除
                await WorkTime_col.deleteOne({
                    'systemId': list[i].systemId,
                    'userId': list[i].userId,
                    'year': list[i].year,
                    'month': list[i].month,
                    'day': list[i].day
                });
            } else { //更改
                await WorkTime_col.updateOne({
                    'systemId': list[i].systemId,
                    'userId': list[i].userId,
                    'year': list[i].year,
                    'month': list[i].month,
                    'day': list[i].day
                }, {
                    time: list[i].time
                });
            }
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
    if (workTimeList.length!==0) {
        out.info(req.userName+'编辑工时')
    }
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
    out.info('查询统计');
    const time = await WorkTime_col.aggregate([ //按系统查询
        {
            $match: {
                'userId': {
                    '$in': req.people
                },
                'systemId': {
                    '$in': Object.keys(req.system).map(key=> req.system[key])
                },
                'time': {
                    '$nin': [0,null]
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
                'time': {
                    '$nin': [0,null]
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

const exportTime = async (ctx, next) => {
    const req = ctx.query;
    const system = await System_col.find();
    const worktime = await WorkTime_col.find();
    const user = await User_col.find();
    const role = await Role_col.find();
    const menu = await Menu_col.find();
    const department = await Department_col.find();
    const passport = await Passport_col.find();
    let zip = new JSZip();
    zip.file('system.json',JSON.stringify(system,null,2));
    zip.file('worktime.json',JSON.stringify(worktime,null,2));
    zip.file('user.json',JSON.stringify(user,null,2));
    zip.file('role.json',JSON.stringify(role,null,2));
    zip.file('menu.json',JSON.stringify(menu,null,2));
    zip.file('department.json',JSON.stringify(department,null,2));
    zip.file('passport.json',JSON.stringify(passport,null,2));
    let zipName = 'worktimeCopy.zip';
    ctx.status = 200;
    zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        // 写入磁盘
        fs.writeFile('data/' + zipName , content, function (err) {
            if (!err) {
                // 写入磁盘成功
                // if (req.sendMail) {
                //     sendMail();
                // }
            } else {
            }
        });
    });
    ctx.body = {
        code: 1,
        msg: zipName + '压缩成功'
    }
}
module.exports = {
    getTimeList,
    postTime,
    workTimeCount,
    workTimeSeach,
    getMapTime,
    resetTime,
    exportTime
}