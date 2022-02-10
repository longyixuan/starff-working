/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-02-09 15:30:55
 */

const Router = require('koa-router');
const router = new Router();
const return_controller = require('./../../app/controllers/return_controller');

router.post('/return/add', return_controller.add);
router.post('/return/del', return_controller.del);
module.exports = router;