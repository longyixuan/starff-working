/*
 * @Author: yinxl 
 * @Date: 2019-06-27 08:56:44 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-06-27 17:16:23
 */

const uuidv1 = require('uuid/v1');
const moment = require('moment');
 /**user */
const insertUser = (data,callback)=> { //新增用户，可批量
    let addSqlParams = [];
    for (let i = 0; i< data.length;i++) {
        addSqlParams.push([
            uuidv1(),
            data[i].userName,
            data[i].password,
            data[i].passStrength,
            data[i].nickName,
            data[i].email,
            moment(data[i].createdAt).format('YYYY-MM-DD HH:mm:ss'),
            moment().format('YYYY-MM-DD HH:mm:ss'),
            data[i].delFlag,
            data[i].avatar,
            data[i].status,
            data[i].defaultRole,
            data[i].sex,
        ])
    }
    let addSql = 'INSERT INTO user_tbl(userid,username,password,passstrength,nickname,email,createdate,updatedate,delflag,avatar,status,roles,sex) VALUES ?';
    connection.query(addSql,[addSqlParams],function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return callback(false);
        } else {
            return callback(true);
        }
    });
}
const updateUser = (data,callback)=> {  //更新用户
    let updateSqlParams = [
       
    ];
    let updateSql = 'UPDATE user_tbl SET (nickname = ?,email = ?, updatedate = ? status = ?, roles = ?, sex = ?) where userid = ' + data.userId;
    connection.query(updateSql,updateSqlParams,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return callback(false);
        } else {
            return callback(true);
        }
    });
}
const delUser = (data,callback)=> {  //删除用户
    var delSql = 'DELETE FROM user_tbl where userid in ' + data.userId;
    connection.query(delSql,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return;
        }
    });
}
 module.exports = {
    insertUser,
    delUser,
    updateUser
}