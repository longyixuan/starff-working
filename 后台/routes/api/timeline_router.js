/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-21 15:46:58
 */

const Router = require('koa-router');
const router = new Router();
const timeline_controller = require('./../../app/controllers/timeline_controller');
const systimeline_controller = require('./../../app/controllers/systimeline_controller');
const aws_controller = require('./../../app/controllers/aws_controller');

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


// 系统同步时间线

router.post('/systimeline/add', systimeline_controller.add);
router.post('/systimeline/list', systimeline_controller.getList);
router.post('/systimeline/update', systimeline_controller.update);
router.post('/systimeline/delete', systimeline_controller.remove);
router.post('/systimeline/detail', systimeline_controller.getDetail);
router.post('/systimeline/back', systimeline_controller.back);
router.post('/systimeline/commit', systimeline_controller.commit);
router.post('/systimeline/apply', systimeline_controller.apply);

// 需求备案记录
router.post('/aws/add', aws_controller.add);
router.post('/aws/list', aws_controller.getList);
router.post('/aws/update', aws_controller.update);
router.post('/aws/delete', aws_controller.remove);


module.exports = router;