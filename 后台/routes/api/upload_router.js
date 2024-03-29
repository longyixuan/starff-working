/*
 * @Author: yinxl 
 * @Date: 2019-04-12 15:55:27 
 * @Last Modified by: yinxl
 * @Last Modified time: 2023-02-13 17:53:57
 */
const Router = require('koa-router');
const router = new Router();
// const upload_controller = require('./../../app/controllers/upload_controller');
const image_controller = require('./../../app/controllers/image_controller');

const md_controller = require('./../../app/controllers/md_controller');

// router.post('/upload/file', upload_controller.upload);
// router.get('/installTime', upload_controller.installTime);

router.post('/upload/image', image_controller.add);
router.get('/upload/imagelist', image_controller.list);

router.post('/md/add', md_controller.add);
router.post('/md/update', md_controller.update);
router.post('/md/list', md_controller.list);
router.post('/md/detail', md_controller.detail);

module.exports = router;