/*
 * @Author: yinxl 
 * @Date: 2019-04-08 11:00:57 
 * @Last Modified by: yinxl
 * @Last Modified time: 2021-10-18 11:24:09
 */

const Router = require('koa-router');
const router = new Router();
const department_controller = require('./../../app/controllers/department_controller');

router.post('/department/add', department_controller.addDepartment);
router.get('/department/getByParentId/:id', department_controller.getDepartmentList);
router.post('/department/update', department_controller.updateDepartment);
router.post('/department/edit', department_controller.editDepartment);
router.delete('/department/delByIds/:id', department_controller.delDepartment);
router.get('/department/search', department_controller.searchDepartment);
module.exports = router;