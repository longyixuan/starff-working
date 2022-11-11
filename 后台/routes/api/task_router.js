/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:39:35 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-11 13:55:01
 */

const Router = require('koa-router');
const router = new Router();
const task_controller = require('./../../app/controllers/task_controller');

router.post('/task/add', task_controller.add);


module.exports = router;