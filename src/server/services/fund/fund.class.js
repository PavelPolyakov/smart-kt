const Promise = require('bluebird');
const _ = require('lodash');
const Tx = require('ethereumjs-tx');

const lightwallet = require('eth-lightwallet');
const {txutils, signing} = lightwallet;

class Service {
    constructor(options) {
        this.options = options || {};
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        const { app } = this;
        const { web3 } = app;

        return Promise.coroutine(function *() {
            const user = yield app.service('users').get(data.user_id);
            const loan = yield app.service('loans').get(data.loan_id);

            const rawTx = {
                nonce: web3.eth.getTransactionCount(user.wallet.address),
                to: loan.address,
                value: web3.toWei(data.amount / app.get('ETHEUR'), 'ether'),
                data: web3.fromAscii(JSON.stringify({ETHEUR:app.get('ETHEUR')}))
            };

            rawTx.gasLimit = web3.eth.estimateGas(rawTx);

            const tx = new Tx(rawTx);
            tx.sign(new Buffer(user.wallet.privateKey, 'hex'));

            const serializedTx = tx.serialize();
            const hash = web3.eth.sendRawTransaction(serializedTx);

            const SmartKTInstance = app.smartKT.getByAddress(loan.address);
            const state = SmartKTInstance.state();

            loan.funding.push({ user_id: data.user_id, amount: data.amount, hash });
            yield app.service('loans').patch(loan._id, { 'funding': loan.funding, 'state': {
                status: app.service('loans').Model.STATUS[state[0]],
                balance: state[1].toNumber()
            } });
            yield app.service('users').patch(user._id, { 'wallet.balance.ETH': web3.eth.getBalance(user.wallet.address).toNumber() });

            // if it turned to performing, update borrower balance
            if(app.service('loans').Model.STATUS[state[0]] === 'PERFORMING') {
                const borrower = yield app.service('users').get(loan.user_id);
                yield app.service('users').patch(borrower._id, {'wallet.balance.ETH': web3.eth.getBalance(borrower.wallet.address).toNumber()});
            }

        })().bind(this);
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
