/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-12-05 09:05:14
 */

const Router = require('koa-router');
const router = new Router();
const document_controller = require('./../../app/controllers/document_controller');

router.post('/document/add', document_controller.addDocument);
router.get('/document/list', document_controller.seachDocument);
router.get('/document/listALL', document_controller.allDocument);
router.post('/document/commit', document_controller.commitDocument);
router.get('/document/details/:id', document_controller.getDetails);
router.delete('/document/del/:id', document_controller.delDocument);
router.get('/document/reset/:id', document_controller.resetDocument);

module.exports = router;