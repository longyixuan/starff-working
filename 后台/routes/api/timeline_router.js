/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-07 19:57:55
 */

const Router = require('koa-router');
const router = new Router();
const timeline_controller = require('./../../app/controllers/timeline_controller');

router.post('/timeline/add', timeline_controller.add);
router.post('/timeline/list', timeline_controller.getList);

module.exports = router;