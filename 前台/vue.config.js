var os = require('os');
try {
var network = os.networkInterfaces()
localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
localhost = 'localhost';
}
module.exports = {
    devServer: {
        overlay: {
            errors: true,
        },
        port: 9999,
        disableHostCheck: true
    },
    productionSourceMap: false
}