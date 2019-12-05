/*
 * @Author: yinxl 
 * @Date: 2019-11-20 08:55:20 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-05 16:38:32
 */
const Router = require('koa-router');
const router = new Router();
const download_controller = require('./../../app/controllers/download_controller');

router.get('/download/all', download_controller.downloadAll)
router.get('/download/markdown', download_controller.downloadMarkdown)

module.exports = router;