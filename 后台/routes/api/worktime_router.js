/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:02:29 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 14:05:15
 */

const Router = require('koa-router');
const router = new Router();
const worktime_controller = require('./../../app/controllers/worktime_controller');

router.post('/getTimeList', worktime_controller.getTimeList);
router.post('/postTime', worktime_controller.postTime);
module.exports = router;