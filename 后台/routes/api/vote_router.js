/*
 * @Author: yinxl 
 * @Date: 2022-08-16 10:15:53 
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-08-25 13:01:12
 */

const Router = require('koa-router');
const router = new Router();
const vote_controller = require('./../../app/controllers/vote_controller');

router.post('/vote/add', vote_controller.addVote);
router.post('/vote/update', vote_controller.updateVote);
router.post('/vote/delete', vote_controller.removeVote);
router.post('/vote/list', vote_controller.listVote);

router.post('/survey/add', vote_controller.addSurvey);
router.post('/survey/update', vote_controller.editSurvey);
router.post('/survey/detail/:id', vote_controller.detailSurvey);
router.post('/survey/delete', vote_controller.removeSurvey);
router.post('/survey/list', vote_controller.listSurvey);
router.post('/survey/submit', vote_controller.submitSurvey);
router.post('/survey/count', vote_controller.countSurvey);
router.post('/survey/countone', vote_controller.countSurveyOne);

router.post('/survey/mylist', vote_controller.listSurveyMy);
router.post('/survey/mycount', vote_controller.countSurveyMy);

module.exports = router;