/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-11 16:31:50
 */

const Router = require('koa-router');
const router = new Router();
const jira_controller = require('./../../app/controllers/jira_controller');

router.post('/jira/add', jira_controller.add);
router.post('/jira/list', jira_controller.getList);
router.post('/jira/update', jira_controller.update);
router.post('/jira/delete', jira_controller.remove);
router.post('/jira/detail/month', jira_controller.getDetailM);
router.post('/jira/detail/year', jira_controller.getDetailY);
router.post('/jira/detail/user', jira_controller.getDetailP);


module.exports = router;