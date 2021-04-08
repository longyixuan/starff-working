const { logger } = require('../../logger');
module.exports = wss => {
    //广播
    wss.broadcast = function broadcast(ws) {
        wss.clients.forEach(function each(client) {
            client.send(ws);
        });
    };
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            wss.broadcast(message);
            logger.info(message);
        });
        ws.send('欢迎');
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