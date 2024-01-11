/*
 * @Author: yinxl 
 * @Date: 2022-10-22 15:23:08 
 * @Last Modified by: yinxl
 * @Last Modified time: 2024-01-09 11:25:04
 */

const Router = require('koa-router');
const router = new Router();
const jkpt_controller = require('./../../app/controllers/jkpt_controller');

router.post('/jkpt/tag/add', jkpt_controller.addTag);
router.post('/jkpt/tag/update', jkpt_controller.updateTag);
router.post('/jkpt/tag/delete', jkpt_controller.removeTag);
router.post('/jkpt/tag/list', jkpt_controller.listTag);

router.post('/jkpt/add', jkpt_controller.add);
router.post('/jkpt/update', jkpt_controller.update);
router.post('/jkpt/del', jkpt_controller.remove);
router.post('/jkpt/list', jkpt_controller.getList);

module.exports = router;