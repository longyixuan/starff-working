/*
 * @Author: yinxl 
 * @Date: 2019-11-18 11:46:46 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-11-19 08:35:25
 */
let fs = require('fs'); 
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
  // SMTP 连接
let transport = nodemailer.createTransport(smtpTransport({
    // 主机
    host: 'smtp.qq.com',
    // 是否使用 SSL
    secure: false,
    secureConnection: false,
    // 网易的SMTP端口
    port: 25, 
    auth: {
     // 账号
     user: '1402633916@qq.com', 
     // 授权码(自行百度邮箱SMTP的授权码设置)，此处非密码
     pass: 'pgfzqrguonbqhhbc', 
    }
   }));
   // 设置邮件内容
   let mailOptions = {
    // 发件人地址，例如 1234<1234@163.com>
    from: 'yinxl<1402633916@qq.com>', 
    // 收件人地址，可以使用逗号隔开添加多个
    // '***@qq.com, ***@163.com'
    to: 'yinxl@chsi.com.cn', 
    // 标题
    subject: '【工时系统】工时系统定时备份', 
    // 邮件内容可以自定义样式
    html: '<strong style="color: red">工时系统数据备份</strong>',
    //发送附件
    attachments: [
      {
        "filename":"工时系统数据备份.zip",
        "path":"data/工时系统数据备份.zip"
      }
    ]
   }
const sendMail = () => {
  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Message Send Ok')
    }
    // 记得关闭连接
    transport.close();
  })
}
module.exports = sendMail;
