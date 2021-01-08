/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-01-08 17:12:29
 */

const Router = require('koa-router');
const router = new Router();
const timeline_controller = require('./../../app/controllers/timeline_controller');

router.post('/timeline/add', timeline_controller.add);
router.post('/timeline/list', timeline_controller.getList);
router.post('/timeline/lock', timeline_controller.lock);
router.post('/timeline/update', timeline_controller.update);
router.post('/timeline/delete', timeline_controller.remove);
router.post('/timeline/detail', timeline_controller.getDetail);

router.post('/tag/add', timeline_controller.addTag);
router.post('/tag/update', timeline_controller.updateTag);
router.post('/tag/delete', timeline_controller.removeTag);
router.post('/tag/list', timeline_controller.listTag);


module.exports = router;