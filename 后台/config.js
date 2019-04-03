/*
 * @Author: yinxl 
 * @Date: 2019-03-17 14:46:33 
 * @Last Modified by:   yinxl 
 * @Last Modified time: 2019-03-17 14:46:33 
 */

module.exports = {
  port: 3000, // 项目启动的端口
  db: 'mongodb://localhost:27017/worktime', // 数据库
  saltTimes: 3 // 加盐的次数（用户密码加密）
}