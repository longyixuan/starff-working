/*
 * @Author: yinxl 
 * @Date: 2019-03-12 18:40:07 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 14:04:20
 */

const Router = require('koa-router');
const router = new Router();
const system_controller = require('./../../app/controllers/system_controller');

router.post('/system', system_controller.searchSystemByName);
router.post('/systemList', system_controller.getSystemList);

module.exports = router;