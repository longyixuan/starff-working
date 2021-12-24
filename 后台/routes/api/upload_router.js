/*
 * @Author: yinxl 
 * @Date: 2019-04-12 15:55:27 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-04-22 12:07:08
 */
const Router = require('koa-router');
const router = new Router();
const upload_controller = require('./../../app/controllers/upload_controller');
const image_controller = require('./../../app/controllers/image_controller');

router.post('/upload/file', upload_controller.upload);
router.get('/installTime', upload_controller.installTime);

router.post('/upload/image', image_controller.add);
router.post('/upload/imagelist', image_controller.list);

router.post('/link/check', image_controller.check);

module.exports = router;