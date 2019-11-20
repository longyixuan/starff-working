/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:02:29 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-11-18 09:14:53
 */

const Router = require('koa-router');
const router = new Router();
const worktime_controller = require('./../../app/controllers/worktime_controller');

router.post('/time/getTimeList', worktime_controller.getTimeList);
router.post('/time/postTime', worktime_controller.postTime);
router.get('/time/workTimeCount', worktime_controller.workTimeCount);
router.post('/time/workTimeSeach', worktime_controller.workTimeSeach);
router.post('/time/getMapTime', worktime_controller.getMapTime);
router.get('/time/resetTime', worktime_controller.resetTime);
router.get('/exportTime', worktime_controller.exportTime);

module.exports = router;