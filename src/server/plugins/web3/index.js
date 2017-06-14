// web3, for interacting with the ethereum network
const Web3 = require('web3');

module.exports = function () {
    const app = this;
    // web3
    app.web3 = new Web3(new Web3.providers.HttpProvider(app.get('web3').url));
}