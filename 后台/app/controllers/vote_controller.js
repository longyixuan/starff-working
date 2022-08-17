/*
 * @Author: yinxl 
 * @Date: 2022-08-16 10:18:07 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-08-17 13:49:02
 */
const Vote_col = require('./../models/vote');
const Survey_col = require('./../models/survey');
const SurveyResult_col = require('./../models/surveyResult');
const uuidv1 = require('uuid/v1');

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

const detailSurvey = async (ctx, next) => {
    ctx.status = 200;
    const id = ctx.params.id;
    const result = await Survey_col.findOne({
        id: id
    });
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    };
}

const removeSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await Survey_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const listSurvey = async (ctx, next) => {
    ctx.status = 200;
    let result = await Survey_col.find({});
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

const submitSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let item = await SurveyResult_col.findOne({
        surveyId: req.surveyId,
        submitUser: req.submitUser
    });
    console.log(item)
    if (item) {
        ctx.body = {
            code: 0,
            msg: '重复提交'
        };
    } else {
        let data = JSON.parse(req.data);
        data.forEach(element => {
            element.id = uuidv1();
        });
        await SurveyResult_col.insertMany(data);
        ctx.body = {
            code: 1,
            msg: '操作成功'
        };
    }
}

const countSurvey = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
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
                'surveyId': req.id
            }
        },
        {
            $group: {
                _id: {
                    'userName': '$userName'
                },
                content: {
                    $push: {
                        'option': {$arrayElemAt:["$vote_info.voteName",0]},
                        'grade': '$grade'
                    }
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
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: result
    };
}

module.exports = {
    addVote,
    updateVote,
    removeVote,
    listVote,
    addSurvey,
    detailSurvey,
    removeSurvey,
    listSurvey,
    submitSurvey,
    countSurvey
}