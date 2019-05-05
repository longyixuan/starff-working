/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-05 10:10:42
 */

const Router = require('koa-router');
const router = new Router();
const system_controller = require('./../../app/controllers/system_controller');

router.post('/system/add', system_controller.addSystem);
router.get('/system/getByParentId/:id', system_controller.getSystemList);
router.post('/system/update', system_controller.updateSystem);
router.post('/system/edit', system_controller.editSystem);
router.delete('/system/delByIds/:id', system_controller.delSystem);
router.get('/system/getAllList', system_controller.getAllList);
router.get('/system/search', system_controller.searchSystem);
module.exports = router;