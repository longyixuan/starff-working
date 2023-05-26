/*
 * @Author: yinxl 
 * @Date: 2022-11-11 13:39:35 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-05-24 18:46:38
 */

const Router = require('koa-router');
const router = new Router();
const task_controller = require('./../../app/controllers/task_controller');
const tasklist_controller = require('./../../app/controllers/tasklist_controller');

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

// 任务清单
router.post('/tasklist/config/list', tasklist_controller.ztList);
router.post('/tasklist/config/add', tasklist_controller.ztAdd);
router.post('/tasklist/config/edit', tasklist_controller.ztEdit);
router.post('/tasklist/config/del', tasklist_controller.ztDel);

router.post('/tasklist/list', tasklist_controller.List);
router.post('/tasklist/add', tasklist_controller.Add);
router.post('/tasklist/edit', tasklist_controller.Edit);
router.post('/tasklist/del', tasklist_controller.Del);
router.post('/tasklist/detail', tasklist_controller.Detail);



module.exports = router;