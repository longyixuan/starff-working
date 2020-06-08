/*
 * @Author: yinxl 
 * @Date: 2019-11-20 08:55:20 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-08 09:11:02
 */
const Router = require('koa-router');
const router = new Router();
const download_controller = require('./../../app/controllers/download_controller');

router.get('/download/all', download_controller.downloadAll)
router.get('/download/markdown', download_controller.downloadMarkdown)
router.post('/download/document', download_controller.downloadDocument)

module.exports = router;