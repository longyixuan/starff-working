/*
 * @Author: yinxl 
 * @Date: 2023-07-25 18:57:47 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-12-11 15:29:59
 */

const Router = require('koa-router');
const router = new Router();

const icon_controller = require('./../../app/controllers/icon_controller');

router.post('/icon/upload', icon_controller.upload);
router.post('/icon/add', icon_controller.add);
router.post('/icon/edit', icon_controller.edit);
router.post('/icon/del', icon_controller.del);
router.post('/icon/search', icon_controller.search);
router.post('/icon/list', icon_controller.list);
// 图标分类
router.post('/icon/tag/list', icon_controller.tagList);
router.post('/icon/tag/add', icon_controller.tagAdd);
router.post('/icon/tag/edit', icon_controller.tagEdit);
router.post('/icon/tag/del', icon_controller.tagDel);

module.exports = router;