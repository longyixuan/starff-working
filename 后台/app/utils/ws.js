const { logger } = require('../../logger');
const { checking } = require('../../app/controllers/image_controller');
module.exports = wss => {
    //广播
    wss.broadcast = function broadcast(ws) {
        wss.clients.forEach(function each(client) {
            client.send(ws);
        });
    };
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            ws.send(111111);
            wss.broadcast(message);
            console.log('received: %s', message);
        });
        console.log('wss链接已建立');
        // 退出聊天
        ws.on('close', function(close) {
            try{
                wss.broadcast('退出聊天');
            }catch(e){
                console.log('刷新页面了');
            }
        });
    });
}