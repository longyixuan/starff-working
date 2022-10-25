/*
 * @Author: yinxl 
 * @Date: 2022-10-22 15:23:08 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-10-25 09:41:39
 */

const Router = require('koa-router');
const router = new Router();
const fzxt_controller = require('./../../app/controllers/fzxt_controller');

router.post('/fzxt/tag/add', fzxt_controller.addTag);
router.post('/fzxt/tag/update', fzxt_controller.updateTag);
router.post('/fzxt/tag/delete', fzxt_controller.removeTag);
router.post('/fzxt/tag/list', fzxt_controller.listTag);

router.post('/fzxt/add', fzxt_controller.add);
router.post('/fzxt/update', fzxt_controller.update);
router.post('/fzxt/del', fzxt_controller.remove);
router.post('/fzxt/list', fzxt_controller.getList);

module.exports = router;