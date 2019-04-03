/*
 * @Author: yinxl 
 * @Date: 2019-04-02 17:05:36 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-02 17:51:29
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

mongoose.connect(config.db, {useNewUrlParser:true}, (err) => {
    if (err) {
        console.error('Failed to connect to database');
    } else {
        console.log('Connecting database successfully');
    }
});

app.use(cors());
app.use(bodyParser());
/* 路由权限控制 */
const secret = 'secret';
app.use(jwtKoa({ secret: secret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
        /^\/api\/login/,
        /^\/api\/register/,
        /^((?!\/api).)*$/   // 设置除了私有接口外的其它资源，可以不需要认证访问
    ]
}));
const user_router = require('./routes/api/user_router');
const course_router = require('./routes/api/course_router');
const school_router = require('./routes/api/school_router');
const system_router = require('./routes/api/system_router');
const example_router = require('./routes/api/example_router');
const worktime_router = require('./routes/api/worktime_router');

app.use(user_router.routes()).use(user_router.allowedMethods());
app.use(course_router.routes()).use(course_router.allowedMethods());
app.use(school_router.routes()).use(school_router.allowedMethods());
app.use(example_router.routes()).use(example_router.allowedMethods());
app.use(system_router.routes()).use(system_router.allowedMethods());
app.use(worktime_router.routes()).use(worktime_router.allowedMethods());

app.listen(config.port);