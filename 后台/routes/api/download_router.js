/*
 * @Author: yinxl 
 * @Date: 2019-11-20 08:55:20 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-11-20 09:03:35
 */
const Router = require('koa-router');
const router = new Router();
const download_controller = require('./../../app/controllers/download_controller');

router.get('/download/all', download_controller.downloadAll)

module.exports = router;