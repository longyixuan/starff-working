/*
 * @Author: yinxl 
 * @Date: 2019-11-20 13:41:58 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-10-15 10:57:03
 */
const fs = require('fs');
const path = require("path");
const uuidv1 = require('uuid/v1');
const Image_col = require('./../models/images');
const Link_col = require('./../models/link');
let puppeteer =require('puppeteer');
let request = require('sync-request');
const { Console } = require('console');

const add = async (ctx, next) => {
    const req = ctx.request.body;
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let imageId = uuidv1();
    let fileFormat = (file.name).split(".");
    let filePath = path.join(__dirname, '../../images/') + imageId + "." + fileFormat[fileFormat.length - 1];
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    const result = await Image_col.create({
        imageId: imageId,
        imageName: fileFormat.splice(0,fileFormat.length - 1).join(""),
        systemId: req.systemId,
        ext: fileFormat[fileFormat.length - 1]
    });
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '上传成功',
        data: result
    }
};

const video = async (ctx, next) => {
    const req = ctx.request.body;
    console.log(req);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: ''
    }
};

const list = async (ctx, next) => {
    const req = ctx.request.body;
    let seachConfig = {};
    if (req.systemId) {
        seachConfig.systemId = req.systemId
    }
    if (req.tag) {
        seachConfig.tag = req.tag
    }
    let result = await Image_col.aggregate([{
        $match: seachConfig
    }]);
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '查询成功',
        data: result
    }
};
const checkList = async function(url,host,level) {
    let options={
        //使用无头模式，默认为有头(true为无界面模式)
        headless: true,
        ignoreHTTPSErrors : true,
        //设置打开页面在浏览器中的宽高
        defaultViewport:{
            width:1000,
            height:800
        },
        //设置每个步骤放慢250毫秒
        slowMo: 0,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
    //返回浏览器实例
    let browser = await puppeteer.launch(options);
    //创建新页面,并返回页面对象
    let page = await browser.newPage();
    //进入指定页面
    await page.goto(url,{waitUntil: 'networkidle2'});
    let result = await page.$$eval("a",(elements)=>{
        let eles=[];
            elements.forEach(function(item,index){
                if(!(item.getAttribute('href')=='#'||/^javascript/.test(item.getAttribute('href'))||item.getAttribute('href')==null||item.getAttribute('href')=='/')){
                    let href = item.getAttribute('href');
                    let eleObj={
                        href: href,
                        text:item.innerText.replace(/\s+/g, "").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, ""),
                        result: '',
                        code: ''
                    }
                    eles.push(eleObj);
                }
            })
            //返回导航栏的href和文本内容
            return eles;
    })
    await browser.close();
    result.forEach(item=>{
        if (/^\/\//.test(item.href)) {
            item.href = 'https:'+item.href;
        } else if (/^\//.test(item.href)) {
            item.href = host + item.href;
        }
        
    });
    for (let i = 0;i<result.length;i++) {
        let linkResult = await Link_col.findOne({href: result[i].href});
        if (!linkResult) {
            await Link_col.create({
                level: level,
                parentUrl: url,
                href: result[i].href,
                text: result[i].text,
                status: 0,
                result: '',
                code: 0
            });
        }
    }
    return result;
}
const requestUrl = async (level,host,ws) => {
    let linkList = await Link_col.find({level: level});
    for (let j = 0;j<linkList.length;j++) {
        let requestRes = null;
        try {
            requestRes = request('get',linkList[j].href);
        } catch (error) {
            console.log('报错')
        }
        let resultText = '';
        let resultCode = '';
        if (requestRes) {
            if (requestRes.statusCode==200 || requestRes.statusCode==412 || requestRes.statusCode==403) {
                resultCode = requestRes.statusCode;
                resultText = 'success';
                if (requestRes.statusCode==200 && (!/\.(xls|xlsx|doc|DOC|pdf|PDF|dbf|DBF|docx|DOCX)$/.test(linkList[j].text))) {
                    if (linkList[j].href.indexOf(host)!=-1&&level<2) {
                        await checkList(linkList[j].href,host,level+1);
                    }
                }
            } else {
                resultCode = requestRes.statusCode;
                resultText = 'error'
            }
        } else {
            resultCode = 0;
            resultText = 'error'
        }
        await Link_col.updateMany({href: linkList[j].href},{
            status: resultText=='success'?1:2,
            result: resultText,
            code: resultCode
        });
        ws.send(JSON.stringify({
            parentUrl: linkList[j].parentUrl,
            href: linkList[j].href,
            status: resultText=='success'?1:2,
            result: resultText,
            code: resultCode
        }))
        if (j==linkList.length-1) {
            requestUrl(level+1,host,ws);
        }
    }
    ws.send('level'+level+'检查完了');
}
const check = async (ctx, next) => {
    let req = ctx.request.body;
    ctx.status = 200;
    if (req.isList=='list') {
        let result = [];
        let options={
            //使用无头模式，默认为有头(true为无界面模式)
            headless: true,
            ignoreHTTPSErrors : true,
            //设置打开页面在浏览器中的宽高
            defaultViewport:{
                width:1000,
                height:800
            },
            //设置每个步骤放慢250毫秒
            slowMo: 0,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
        //返回浏览器实例
        let browser = await puppeteer.launch(options);
        //创建新页面,并返回页面对象
        let page = await browser.newPage();
        //进入指定页面
        await page.goto(req.url,{waitUntil: 'networkidle2'});
        result = await page.$$eval("a",(elements)=>{
            let eles=[];
            elements.forEach(function(item,index){
                if(!(/^#/.test(item.getAttribute('href'))||item.getAttribute('href')=='#'||/^javascript/.test(item.getAttribute('href'))||item.getAttribute('href')==null||item.getAttribute('href')=='/')){
                    let href = item.getAttribute('href');
                    let eleObj={
                        href: href,
                        text:item.innerText.replace(/\s+/g, "").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, ""),
                        result: '',
                        code: ''
                    }
                    eles.push(eleObj);
                }
            })
            //返回导航栏的href和文本内容
            return eles;
        })
        await browser.close();
        result.forEach(item=>{
            if (/^\/\//.test(item.href)) {
                item.href = 'https:'+item.href;
            } else if (/^\//.test(item.href)) {
                item.href = req.host + item.href;
            }
            
        });
        for (let i = 0;i<result.length;i++) {
            let link = await Link_col.findOne({href: result[i].href});
            if (!link) {
                await Link_col.create({
                    level: 1,
                    parentUrl: req.parentUrl,
                    href: result[i].href,
                    text: result[i].text,
                    status: 0,
                    result: '',
                    code: 0
                });
            }
        }
        ctx.body = {
            code: 1,
            msg: '加载列表',
            data: result
        }
    } else {
        let result = request('get',req.url);
        let resultText = '';
        let resultCode = '';
        if (req.url.indexOf(req.host)!=-1) {
            await checkList(req.url,req.host,parentUrl);
        }
        if (result) {
            if (result.statusCode==200 || result.statusCode==412 || result.statusCode==403) {
                resultCode = result.statusCode;
                resultText = 'success';
            } else {
                resultCode = result.statusCode;
                resultText = 'error'
            }
        } else {
            resultCode = 0;
            resultText = 'error'
        }
        await Link_col.updateMany({href: req.url},{
            status: resultText=='success'?1:2,
            result: resultText,
            code: resultCode
        });
        ctx.body = {
            code: 1,
            msg: '检查链接',
            data: {
                result: resultText,
                code: resultCode
            }
        }
    }
};
const checking = async (message,ws) => {
    if (message.type=='checkLink') {
        ws.send('正在检测，请稍后...')
        requestUrl(1,message.host,ws);
    }
}
module.exports = {
    add,
    list,
    check,
    checking,
    video
}