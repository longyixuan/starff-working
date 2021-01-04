/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-04 16:08:13
 */

const Router = require('koa-router');
const router = new Router();
const timeline_controller = require('./../../app/controllers/timeline_controller');

router.post('/timeline/add', timeline_controller.add);

module.exports = router;