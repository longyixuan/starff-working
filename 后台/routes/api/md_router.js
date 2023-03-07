/*
 * @Author: yinxl 
 * @Date: 2019-04-12 15:55:27 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-03 08:38:04
 */
const Router = require('koa-router');
const router = new Router();

const md_controller = require('./../../app/controllers/md_controller');

router.post('/md/add', md_controller.add);
router.post('/md/update', md_controller.update);
router.post('/md/list', md_controller.list);
router.post('/md/detail', md_controller.detail);
router.post('/md/show', md_controller.detailByTitle);

router.post('/mdtype/add', md_controller.addType);
router.post('/mdtype/update', md_controller.updateType);
router.post('/mdtype/list', md_controller.listType);
router.post('/mdtype/del', md_controller.delType);

module.exports = router;