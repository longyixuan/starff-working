/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2020-06-03 12:08:51
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

router.post('/template/add', document_controller.addTemplate);
router.get('/template/list', document_controller.seachTemplate);
router.get('/template/details/:id', document_controller.getTemplateDetails);
router.post('/template/merge', document_controller.mergeTemplate);
router.post('/template/commit', document_controller.commitTemplate);
router.delete('/template/del/:id', document_controller.delTemplate);
router.get('/template/listALL', document_controller.allTemplate);
router.get('/template/reset/:id', document_controller.resetTemplate);

//日总结
router.post('/document/day/add', document_controller.addDocumentday);
router.post('/document/day/edit', document_controller.editDocumentday);
router.post('/document/day/del', document_controller.delteDocumentday);
router.get('/document/day/details', document_controller.detailsDocumentday);
router.get('/document/day/list', document_controller.listDocumentday);
router.post('/document/day/merge', document_controller.mergeDocumentday);
router.post('/document/seach', document_controller.seachDocumentday);
router.get('/modal/seach', document_controller.seachModal);
router.post('/modal/add', document_controller.addModal);
module.exports = router;