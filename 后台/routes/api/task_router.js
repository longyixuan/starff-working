/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:39:35 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-11-14 16:20:39
 */

const Router = require('koa-router');
const router = new Router();
const task_controller = require('./../../app/controllers/task_controller');

router.post('/task/add', task_controller.add);
router.post('/task/list', task_controller.getList);


module.exports = router;