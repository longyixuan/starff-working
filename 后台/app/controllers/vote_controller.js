/*
 * @Author: yinxl 
 * @Date: 2022-08-16 10:18:07 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-14 11:03:24
 */
const Vote_col = require('./../models/vote');
const Survey_col = require('./../models/survey');
const SurveyResult_col = require('./../models/surveyResult');
const uuidv1 = require('uuid/v1');
const jsonwebtoken = require('jsonwebtoken');
const User_col = require('./../models/user');

const addVote = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Vote_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const updateVote = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Vote_col.updateOne({
        id: req.id
    }, req);
    const result = await Vote_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const removeVote = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Vote_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listVote = async (ctx, next) => {
    ctx.status = 200;
    let result = await Vote_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const addSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    req.id = uuidv1();
    await Survey_col.create(req);
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const editSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Survey_col.updateMany({
        id: req.id
    },{
        endDate: req.endDate
    });
    ctx.body = {
        code: 1,
        msg: '设置成功'
    };
}

const detailSurvey = async (ctx, next) => {
    ctx.status = 200;
    const id = ctx.params.id;
    const result = await Survey_col.findOne({
        id: id
    });
    if (result) {
        if (result.endDate.getTime() > new Date().getTime()) {
            ctx.body = {
                code: 1,
                msg: '请求成功',
                data: result
            };
        } else {
            ctx.body = {
                code: 0,
                msg: '投票时间已截至',
                data: {
                    surveyName: result.surveyName,
                    date: result.date
                }
            };
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '问卷不存在',
            data: {
                surveyName: '',
                date: ''
            }
        };
    }
}

const removeSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let item = await SurveyResult_col.findOne({
        surveyId: req.id
    });
    if (item) {
        if (req.reset == 'true') {
            await SurveyResult_col.deleteMany({
                surveyId: req.id
            });
            await Survey_col.updateOne({
                id: req.id
            }, {
                voteUser: []
            });
            ctx.body = {
                code: 0,
                msg: '已删除投票结果'
            };
        } else {
            ctx.body = {
                code: 0,
                msg: '存在投票结果，无法删除'
            };
        }
    } else {
        await Survey_col.deleteMany({
            id: req.id
        });
        ctx.body = {
            code: 1,
            msg: '删除成功'
        };
    }
}

const listSurvey = async (ctx, next) => {
    ctx.status = 200;
    let result = await Survey_col.find({});
    let data = [];
    for (let i = 0;i<result.length;i++) {
        let num =  await SurveyResult_col.aggregate([
            {
                $match: {
                    'surveyId': result[i].id
                }
            },
            {
                $group: {
                    _id: {
                        'option': '$option',
                        'userName': '$userName'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: "$count"
                }
            },
        ]);
        data.push({
            'date': result[i].date,
            'id': result[i].id,
            'option': result[i].option,
            'surveyName': result[i].surveyName,
            'user': result[i].user,
            'voteUser': result[i].voteUser,
            'endDate': result[i].endDate,
            'num': num.length>0?num[0].count:0
        })
    }
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: data
    };
}

const listSurveyMy = async (ctx, next) => {
    ctx.status = 200;
    const token = ctx.request.headers.accesstoken;
    try {
        const json = await jsonwebtoken.verify(token, 'jwtSecret');
        const user = await User_col.findOne({'userName': json.data.userName});
        if (user) {
            let result = await SurveyResult_col.aggregate([
                {
                    $lookup: {
                        from: "survey",
                        localField: "surveyId",
                        foreignField: "id",
                        as: "survey_info"
                    }
                },
                {
                    $match: {
                        'userName': user.nickName
                    }
                },
                {
                    $group: {
                        _id: {
                            'surveyId': '$surveyId',
                            'survey_info': '$survey_info'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        surveyId: '$_id.surveyId',
                        surveyName: {$arrayElemAt:["$_id.survey_info.surveyName",0]},
                        date: {$arrayElemAt:["$_id.survey_info.date",0]},
                        endDate: {$arrayElemAt:["$_id.survey_info.endDate",0]},
                    }
                }
            ]);
            let data = [];
            result.forEach(element => {
                if ( new Date().getTime() > element.endDate.getTime()) {
                    data.push(element);
                }
            });
            ctx.body = {
                code: 1,
                msg: '查询成功',
                data: data
            };
        } else {
            ctx.body = {
                code: 0,
                msg: '请求失败'
            }
        }
    } catch (error) {
        ctx.body = {
            code: 2,
            msg: '登录验证失败'
        }
    }
}

const submitSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Vote_col.updateOne({
        id: req.id
    }, req);
    const result = await Survey_col.findOne({
        id: req.surveyId
    });
    if (result.voteUser.indexOf(req.userName)!==-1) { //已投
        ctx.body = {
            code: 0,
            msg: '请勿重复投票'
        };
    } else {
        let data = JSON.parse(req.data);
        data.forEach(element => {
            element.id = uuidv1();
        });
        await SurveyResult_col.insertMany(data);
        await Survey_col.updateOne({
            id: req.surveyId
        }, {
            voteUser: [...result.voteUser, req.userName]
        });
        ctx.body = {
            code: 1,
            msg: '操作成功'
        };
    }
}

const countSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const result2 = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': {
                    $in: req.people
                }
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName',
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                option: '$_id.option',
                grade: '$grade'
            }
        },
        {
            $sort: {
                grade: -1
            }
        },
        {
            $group: {
                _id: {
                    'option': '$option'
                },
                content: {
                    $push: {
                        'userName': '$userName',
                        'total': '$grade'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                option: '$_id.option',
                content: '$content'
            }
        }
    ]);
    const result = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': {
                    $in: req.people
                }
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName',
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                option: '$_id.option',
                grade: '$grade'
            }
        },
        {
            $sort: {
                grade: -1
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName'
                },
                total: {
                    "$sum": "$grade"
                },
                content: {
                    $push: {
                        'option': '$option',
                        'total': '$grade'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                total: '$total',
                content: '$content'
            }
        },
        {
            $sort: {
                total: -1
            }
        }
    ]);
    const result3 = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': {
                    $in: req.people
                }
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName',
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                option: '$_id.option',
                grade: '$grade'
            }
        },
        {
            $sort: {
                userName: -1
            }
        },
        {
            $group: {
                _id: {
                    'option': '$option'
                },
                content: {
                    $push: {
                        'userName': '$userName',
                        'total': '$grade'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                option: '$_id.option',
                content: '$content'
            }
        }
    ]);
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result,
        data2: result2,
        data3: result3
    };
}

const countSurveyMy = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const token = ctx.request.headers.accesstoken;
    try {
        const json = await jsonwebtoken.verify(token, 'jwtSecret');
        const user = await User_col.findOne({'userName': json.data.userName});
        const survey = await Survey_col.findOne({'id': req.id});
        if (!survey) {
            ctx.body = {
                code: 0,
                msg: '投票不存在'
            }
        }
        if (user) {
            const num =  await SurveyResult_col.aggregate([
                {
                    $match: {
                        'surveyId': req.id
                    }
                },
                {
                    $group: {
                        _id: {
                            'option': '$option',
                            'userName': '$userName'
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        count: "$count"
                    }
                },
            ]);
            const result = await SurveyResult_col.aggregate([
                {
                    $lookup: {
                        from: "vote",
                        localField: "option",
                        foreignField: "id",
                        as: "vote_info"
                    }
                },
                {
                    $match: {
                        'surveyId': req.id,
                        'userName': user.nickName
                    }
                },
                {
                    $group: {
                        _id: {
                            'option': {$arrayElemAt:["$vote_info.voteName",0]}
                        },
                        grade: {
                            "$sum": "$grade"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        option: '$_id.option',
                        grade: '$grade'
                    }
                }
            ]);
            const result2 = await SurveyResult_col.aggregate([
                {
                    $lookup: {
                        from: "vote",
                        localField: "option",
                        foreignField: "id",
                        as: "vote_info"
                    }
                },
                {
                    $match: {
                        'surveyId': req.id,
                        'userName': {
                            $in: req.people
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            'userName': '$userName',
                            'option': {$arrayElemAt:["$vote_info.voteName",0]}
                        },
                        grade: {
                            "$sum": "$grade"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userName: '$_id.userName',
                        option: '$_id.option',
                        grade: '$grade'
                    }
                },
                {
                    $sort: {
                        grade: -1
                    }
                },
                {
                    $group: {
                        _id: {
                            'userName': '$userName'
                        },
                        total: {
                            "$sum": "$grade"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userName: '$_id.userName',
                        total: '$total'
                    }
                },
                {
                    $sort: {
                        total: -1
                    }
                }
            ]);
            const result3 = await SurveyResult_col.aggregate([
                {
                    $lookup: {
                        from: "vote",
                        localField: "option",
                        foreignField: "id",
                        as: "vote_info"
                    }
                },
                {
                    $match: {
                        'surveyId': req.id,
                        'userName': {
                            $in: req.people
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            'userName': '$userName',
                            'option': {$arrayElemAt:["$vote_info.voteName",0]}
                        },
                        grade: {
                            "$sum": "$grade"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userName: '$_id.userName',
                        option: '$_id.option',
                        grade: '$grade'
                    }
                },
                {
                    $sort: {
                        grade: -1
                    }
                },
                {
                    $group: {
                        _id: {
                            'option': '$option'
                        },
                        content: {
                            $push: {
                                'userName': '$userName',
                                'total': '$grade'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        option: '$_id.option',
                        content: '$content'
                    }
                }
            ]);
            let ranking = [
                {
                    name: '总分',
                    ranking: orderList(result2, user.nickName),
                    max: getMax(result2)
                }
            ]
            result3.forEach(element => {
                ranking.push({
                    name: element.option,
                    ranking: orderList(element.content, user.nickName),
                    max: getMax(element.content)
                });
            });
            ctx.body = {
                code: 1,
                msg: '请求成功',
                surveyName: survey.surveyName,
                date: survey.date,
                ranking: ranking,
                data: result,
                num: num.length>0?num[0].count:0
            };
        } else {
            ctx.body = {
                code: 0,
                msg: '请求失败'
            }
        }
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: '请求失败'
        }
    }
}

const countSurveyOne = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    const survey = await Survey_col.findOne({'id': req.id});
    const num =  await SurveyResult_col.aggregate([
        {
            $match: {
                'surveyId': req.id
            }
        },
        {
            $group: {
                _id: {
                    'option': '$option',
                    'userName': '$userName'
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                count: "$count"
            }
        },
    ]);
    const result = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': req.userName
            }
        },
        {
            $group: {
                _id: {
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                option: '$_id.option',
                grade: '$grade'
            }
        }
    ]);
    const result2 = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': {
                    $in: req.people
                }
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName',
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                option: '$_id.option',
                grade: '$grade'
            }
        },
        {
            $sort: {
                grade: -1
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName'
                },
                total: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                total: '$total'
            }
        },
        {
            $sort: {
                total: -1
            }
        }
    ]);
    const result3 = await SurveyResult_col.aggregate([
        {
            $lookup: {
                from: "vote",
                localField: "option",
                foreignField: "id",
                as: "vote_info"
            }
        },
        {
            $match: {
                'surveyId': req.id,
                'userName': {
                    $in: req.people
                }
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName',
                    'option': {$arrayElemAt:["$vote_info.voteName",0]}
                },
                grade: {
                    "$sum": "$grade"
                }
            }
        },
        {
            $project: {
                _id: 0,
                userName: '$_id.userName',
                option: '$_id.option',
                grade: '$grade'
            }
        },
        {
            $sort: {
                grade: -1
            }
        },
        {
            $group: {
                _id: {
                    'option': '$option'
                },
                content: {
                    $push: {
                        'userName': '$userName',
                        'total': '$grade'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                option: '$_id.option',
                content: '$content'
            }
        }
    ]);
    let ranking = [
        {
            name: '总分',
            ranking: orderList(result2, req.userName),
            max: getMax(result2)
        }
    ]
    result3.forEach(element => {
        ranking.push({
            name: element.option,
            ranking: orderList(element.content, req.userName),
            max: getMax(element.content)
        });
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        surveyName: survey.surveyName,
        date: survey.date,
        ranking: ranking,
        data: result,
        num: num.length>0?num[0].count:0
    };
}

function orderList(list, userName) {
    let prescore = 0;//预定义分数
    let ranking = 0;//排名
    let same = 0; //是否相同
    let mark = 0;
    list.forEach((item,index)=>{
        if(item.total==prescore){
            item.ranking = ranking;
            same++;
        }else{
            ranking = ranking + same;
            ranking++;
            prescore = item.total;
            same=0;
            item.ranking = ranking;
        }
        if (userName == item.userName) {
            mark = item.ranking;
        }
    })
    return mark;
}

function getMax(list) {
    let max = 0;
    list.forEach((item)=>{
        max = item.total > max ? item.total : max;
    })
    return max;
}

module.exports = {
    addVote,
    updateVote,
    removeVote,
    listVote,
    addSurvey,
    editSurvey,
    detailSurvey,
    removeSurvey,
    listSurvey,
    submitSurvey,
    countSurvey,
    listSurveyMy,
    countSurveyMy,
    countSurveyOne
}