/*
 * @Author: yinxl 
 * @Date: 2022-09-02 12:43:42 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-09-06 18:57:32
 */

const Router = require('koa-router');
const router = new Router();
const design_controller = require('./../../app/controllers/design_controller');

router.post('/design/tag/add', design_controller.addTag);
router.post('/design/update', design_controller.updateTag);
router.post('/design/delete', design_controller.removeTag);
router.post('/design/tag/list', design_controller.listTag);

router.post('/design/add', design_controller.add);
router.post('/design/detail', design_controller.detail);
router.post('/design/all', design_controller.all);

module.exports = router;