/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-01-28 16:08:33
 */

const Router = require('koa-router');
const router = new Router();
const replay_controller = require('./../../app/controllers/replay_controller');

router.post('/replay/add', replay_controller.addReplay);
router.post('/replay/update', replay_controller.updateReplay);
router.post('/replay/getList', replay_controller.getReplayList);
module.exports = router;