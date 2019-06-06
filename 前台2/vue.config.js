var os = require('os');
var lacalhost = ''
try {
var network = os.networkInterfaces()
localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
localhost = 'localhost';
}
module.exports = {
    devServer: {
        host: lacalhost,
        overlay: {
            errors: true,
        },
        proxy: {
            '/api': {
                target: 'http://172.16.10.185:3333',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        port: 9999
    },
    productionSourceMap: false
}