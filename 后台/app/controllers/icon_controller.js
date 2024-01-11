/*
 * @Author: yinxl
 * @Date: 2022-07-21 13:43:59
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-12-13 08:55:06
 */
const fs = require("fs");
const path = require("path");

const uuidv1 = require('uuid/v1');
const Icon_col = require('./../models/icon');
const IconTag_col = require('./../models/iconTag');
const upload = async(ctx, next) => {
    const req = ctx.request.body;
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let outputPath = path.join(__dirname, '../../icons/') + file.name;
    const upStream = fs.createWriteStream(outputPath);
    reader.pipe(upStream);
    ctx.status = 200;
    // 读取 JSON 文件内容
    try {
        const fileContent = fs.readFileSync(file.path, 'utf-8');
        const jsonData = JSON.parse(fileContent).glyphs;
        const createdTime = new Date();
        const userName = req.userName;
        for (let index = 0; index < jsonData.length; index++) {
            let arr = jsonData[index].name.split('/');
            let result = await Icon_col.findOne({name: jsonData[index].font_class});
            if (!result) {
                await Icon_col.create({
                    id: uuidv1(),
                    name: jsonData[index].font_class,
                    code: jsonData[index].unicode,
                    createdTime: createdTime,
                    keywords: arr[1],
                    type: arr[2]=='填充'?'block':'line',
                    userName: userName
                });
            }
        }
        ctx.body = {
            code: 1,
            msg: '上传成功'
        }
    } catch (error) {
        console.error('解析 JSON 文件时出现异常：', error);
        ctx.body = {
            code: 0,
            msg: '解析 JSON 文件时出现异常'
        }
    }
}

const add = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let icon = await Icon_col.findOne({
        name: req.name
    });
    let icon2 = await Icon_col.findOne({
        code: req.code
    });
    console.log(req.code)
    if (icon) {
        ctx.body = {
            code: 0,
            msg: `图标${req.name}已存在，请修改图标名称`,
        }
    } else if (icon2) {
        ctx.body = {
            code: 0,
            msg: `代码已存在，名称为${req.name}`,
        }
    }else{ //新增
        req.id = uuidv1();
        req.createdTime = new Date();
        let result = await Icon_col.create(req);
        ctx.body = {
            code: 1,
            msg: '新增成功',
            data: result
        }
    }
}

const edit = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    let icon = await Icon_col.findOne({
        id: req.id
    });
    if (icon) { //修改
        await Icon_col.updateOne({
            id: req.id
        }, {
            name: req.name,
            type: req.type,
            tag: req.tag,
            userName: req.userName,
            keywords: req.keywords
        });
        let result = await Icon_col.findOne({
            id: req.id
        });
        ctx.body = {
            code: 1,
            msg: '修改成功',
            data: result
        }
    } else {
        ctx.body = {
            code: 1,
            msg: '图标不存在'
        }
    }
}

const search = async (ctx, next) => {
    const req = ctx.request.body;
    let icon = await Icon_col.findOne({
        name: req.name
    });
    ctx.status = 200;
    if (icon) {
        ctx.body = {
            code: 0,
            msg: '已存在该名称的图标，请修改图标名称后上传',
            data: icon
        };
    } else {
        ctx.body = {
            code: 1,
            msg: ''
        };
    }
}

const detail = async (ctx, next) => {
    const req = ctx.request.body;
    let icon = await Icon_col.findOne({
        id: req.id
    });
    ctx.status = 200;
    if (icon) {
        ctx.body = {
            code: 1,
            msg: '',
            data: icon
        };
    } else {
        ctx.body = {
            code: 0,
            msg: '图标不存在'
        };
    }
}

const del = async (ctx, next) => {
    const req = ctx.request.body;
    let icon = await Icon_col.findOne({
        id: req.id
    });
    ctx.status = 200;
    await Icon_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功',
    };
}

const list = async (ctx, next) => {
    const { keywords, type, tag } = ctx.request.body;
    const query = {};
    if (type) {
        query.type = type;
    }
    if (keywords) {
        const regex = new RegExp(keywords, "i");
        query.$or = [
            {
                keywords: regex
            },
            {
                name: regex
            }
        ]
    }
    let iconList = await Icon_col.find(query).sort({name: 1});
    ctx.status = 200;
    ctx.body = {
        code: 1,
        data: iconList
    };
}

const tagAdd = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await IconTag_col.create({
        id: uuidv1(),
        name: req.name,
        order: req.order
    });
    ctx.body = {
        code: 1,
        msg: '新增成功'
    };
}

const tagEdit = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await IconTag_col.updateOne({
        id: req.id
    }, {
        name: req.name,
        order: req.order
    });
    const result = await IconTag_col.findOne({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: result
    };
}

const tagDel = async (ctx, next) => {
    ctx.status = 200;
    const req = ctx.request.body;
    await IconTag_col.deleteMany({
        id: req.id
    });
    ctx.body = {
        code: 1,
        msg: '删除成功'
    };
}

const tagList = async (ctx, next) => {
    ctx.status = 200;
    let result = await IconTag_col.find({}).sort({order: 1 });
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    };
}

module.exports = {
    upload,
    add,
    edit,
    del,
    search,
    list,
    tagList,
    tagAdd,
    tagEdit,
    tagDel
}