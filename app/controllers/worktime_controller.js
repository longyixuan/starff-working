/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:06:49 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-29 15:34:30
 */

const Work_col = require('./../models/workTime');
const System_col = require('./../models/system');
const UserSystem_col = require('./../models/userSystem');

const getTimeList = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const mysystem = await UserSystem_col.find({userId: req.userId},'systemId');
    let mysystemList = [];
    for (let i = 0; i<mysystem.length;i++) {
        mysystemList.push(mysystem[i].systemId);
    }
    const systemList = await System_col.find({
        'id': {
            $in: mysystemList
        }
    });
    let seachList = [];
    for (let i = 0;i<systemList.length;i++) {
        let query = {
            'systemId': systemList[i].id,
            'userId': req.userId,
            'year': req.year,
            'month': req.month
        }
        await Work_col.aggregate([
            {$match: query},
            {$project:{day: '$day', duration:'$time',_id:0 }}
        ]).then((time)=> {
            seachList.push({
                'systemId': query.systemId,
                'systemName': systemList[i].name,
                'userId': query.userId,
                'year': query.year,
                'month': query.month,
                'timeList': time
            })
        })
    }
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: seachList
    };
}

const postTime = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Work_col.collection.insert(req.data, function(err, docs){
        console.log(err)
    })
    const workTimeList = await Work_col.find({systemId: req.systemId,userId:req.userId,year:req.year,month:req.month})
    ctx.body = {
        code: 1,
        msg: '保存成功',
        data: workTimeList
    };
}

module.exports = {
    getTimeList,
    postTime
}