/*
 * @Author: yinxl 
 * @Date: 2019-04-12 15:55:27 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-12 17:33:41
 */
const Router = require('koa-router');
const router = new Router();
const upload_controller = require('./../../app/controllers/upload_controller');

router.post('/upload/file', upload_controller.upload);

module.exports = router;