/*
 * @Author: yinxl 
 * @Date: 2019-03-15 17:11:34 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-05-06 17:32:34
 */

const Router = require('koa-router');
const router = new Router();
const user_controller = require('./../../app/controllers/user_controller');

router.get('/user/getByCondition', user_controller.getByCondition);
router.get('/user/getAllUser', user_controller.getAllUser);
router.post('/login', user_controller.login);
router.post('/regist', user_controller.register);
router.get('/user/info', user_controller.getUserInfo);
router.post('/user/unlock', user_controller.unLock);
router.post('/user/edit', user_controller.updateUserInfo);
router.post('/user/admin/edit', user_controller.adminEdit);
router.post('/user/admin/disable/:id', user_controller.userDisable);
router.post('/user/admin/enable/:id', user_controller.userEnable);
router.delete('/user/delByIds/:id', user_controller.delUser);
router.post('/user/userSystem', user_controller.userSystem);
router.post('/user/modifyPass', user_controller.resetPassword);
router.get('/user/getByDepartmentId/:id', user_controller.getByDepartment);
module.exports = router;