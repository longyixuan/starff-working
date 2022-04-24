/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-04-21 19:17:53
 */

const Router = require('koa-router');
const router = new Router();
const jira_controller = require('./../../app/controllers/jira_controller');

router.post('/jira/add', jira_controller.add);
router.post('/jira/list', jira_controller.getList);
router.post('/jira/update', jira_controller.update);
router.post('/jira/delete', jira_controller.remove);
router.post('/jira/detail/month', jira_controller.getDetailM);
router.post('/jira/detail/user', jira_controller.getDetailP);


module.exports = router;