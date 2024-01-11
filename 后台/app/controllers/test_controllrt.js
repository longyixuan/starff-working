/*
 * @Author: yinxl 
 * @Date: 2023-06-05 13:53:10 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-06-05 13:54:27
 * 测试轮询脚本
 */


const startProgress = async (ctx, next) => {
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '开始轮询'
    };
}

const getProgress = async (ctx, next) => {
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '请求轮询'
    };
}

module.exports = {
    startProgress,
    getProgress
}