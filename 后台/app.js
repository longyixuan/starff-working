/*
 * @Author: yinxl 
 * @Date: 2019-04-02 17:05:36 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-06 19:15:39
 */


const Koa = require('koa');
const config = require('./config');

// https://www.npmjs.com/package/koa2-cors
const cors = require('koa2-cors');

// https://www.npmjs.com/package/koa-bodyparser
const bodyParser = require('koa-bodyparser');

// https://github.com/Automattic/mongoose
const mongoose = require('mongoose');

const jwtKoa = require('koa-jwt'); // 用于路由权限控制


const app = new Koa();

mongoose.connect(config.db, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.error('fail');
    } else {
        console.log('success');
    }
});

app.use(cors());
app.use(bodyParser());
/* 路由权限控制 */
// 错误处理
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = '登陆验证失败';
        } else {
            throw err;
        }
    })
})
app.use(jwtKoa({
    secret: 'jwtSecret',
    key: 'accessToken',
    passthrough: true
}).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
        /^\/login/,
        /^\/regist/
    ]
}));

const user_router = require('./routes/api/user_router');
const system_router = require('./routes/api/system_router');
const worktime_router = require('./routes/api/worktime_router');
const department_router = require('./routes/api/department_router');
const role_router = require('./routes/api/role_router');
const menu_router = require('./routes/api/menu_router');
// const upload_router = require('./routes/api/upload_router');

app.use(user_router.routes()).use(user_router.allowedMethods());
app.use(system_router.routes()).use(system_router.allowedMethods());
app.use(worktime_router.routes()).use(worktime_router.allowedMethods());
app.use(department_router.routes()).use(department_router.allowedMethods());
app.use(role_router.routes()).use(role_router.allowedMethods());
app.use(menu_router.routes()).use(menu_router.allowedMethods());
// app.use(upload_router.routes()).use(upload_router.allowedMethods());

app.listen(config.port);