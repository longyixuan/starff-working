/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-11 17:50:02
 */

const Router = require('koa-router');
const router = new Router();
const model_controller = require('./../../app/controllers/model_controller');

router.post('/sysmodel/add', model_controller.add);
router.post('/sysmodel/update', model_controller.update);
router.post('/sysmodel/delete', model_controller.del);
router.post('/sysmodel/list', model_controller.getlist);

module.exports = router;