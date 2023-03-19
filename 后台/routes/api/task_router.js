/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:39:35 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-03-07 16:17:14
 */

const Router = require('koa-router');
const router = new Router();
const task_controller = require('./../../app/controllers/task_controller');

router.post('/task/add', task_controller.add);
router.post('/task/edit', task_controller.update);
router.post('/task/remove', task_controller.remove);
router.post('/task/list', task_controller.getList);
router.post('/task/listc', task_controller.getListC);
router.post('/task/log', task_controller.getLog);
router.post('/task/daylog', task_controller.getDayLog);
router.post('/task/history', task_controller.hisLog);
router.post('/task/check', task_controller.checkLog);
router.post('/task/tongji', task_controller.tongji);

router.post('/task/zt/list', task_controller.ztList);
router.post('/task/zt/add', task_controller.ztAdd);
router.post('/task/zt/edit', task_controller.ztEdit);
router.post('/task/zt/del', task_controller.ztDel);


module.exports = router;