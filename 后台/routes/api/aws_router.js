/*
 * @Author: yinxl
 * @Date: 2022-07-21 13:40:44
 * @Last Modified by: yinxl
 * @Last Modified time: 2022-07-21 13:43:16
 */

const Router = require('koa-router');
const router = new Router();
const aws_controller = require('./../../app/controllers/aws_controller');

router.post('/aws/add', aws_controller.add);
router.post('/aws/list', aws_controller.getList);
router.post('/aws/update', aws_controller.update);
router.post('/aws/delete', aws_controller.remove);
router.post('/aws/detail', aws_controller.getDetail);


module.exports = router;