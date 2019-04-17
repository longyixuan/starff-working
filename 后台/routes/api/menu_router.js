/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-16 22:45:23
 */

const Router = require('koa-router');
const router = new Router();
const menu_controller = require('./../../app/controllers/menu_controller');

router.delete('/permission/delByIds/:id', menu_controller.delmenu);
router.post('/permission/add', menu_controller.addmenu);
router.post('/permission/edit', menu_controller.editmenu);
router.get('/permission/getMenuList', menu_controller.getMenuList)
router.get('/permission/getAllList', menu_controller.getAllList)

module.exports = router;