/*
 * @Author: yinxl 
 * @Date: 2019-03-15 17:11:34 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-15 17:31:34
 */

const Router = require('koa-router');
const router = new Router();
const user_controller = require('./../../app/controllers/user_controller');

router.get('/get', user_controller.get);
router.post('/post', user_controller.post);
router.post('/login', user_controller.login);
router.post('/register', user_controller.register);
router.post('/update/user', user_controller.updateUserInfo);
router.get('/userList', user_controller.getUserList);

module.exports = router;