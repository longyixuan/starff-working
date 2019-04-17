/*
 * @Author: yinxl 
 * @Date: 2019-04-08 16:00:59 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-13 11:22:02
 */

const Router = require('koa-router');
const router = new Router();
const role_controller = require('./../../app/controllers/role_controller');

router.post('/role/save', role_controller.addRole);
// router.post('/role/edit', role_controller.editRole);
router.get('/role/getAllByPage', role_controller.getAllByPage);
router.get('/role/getAllList', role_controller.getAllList);
router.delete('/role/delAllByIds/:id', role_controller.delRole);

module.exports = router;