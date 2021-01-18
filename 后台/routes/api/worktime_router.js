/*
 * @Author: yinxl 
 * @Date: 2019-03-19 22:02:29 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-18 16:32:56
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
router.post('/time/check', worktime_controller.checkTime);
router.post('/time/weekcheck', worktime_controller.checkWeekTime);
router.post('/personal/console', worktime_controller.personalCount);

module.exports = router;