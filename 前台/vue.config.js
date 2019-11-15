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
        port: 9999
    },
    productionSourceMap: false
}