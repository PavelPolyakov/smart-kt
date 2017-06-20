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

            const txOptions = {
                nonce: web3.eth.getTransactionCount(user.wallet.address),
                to: loan.address,
                value: web3.toWei(data.amount / app.get('ETHEUR'), 'ether')
            };

            txOptions.gasLimit = web3.eth.estimateGas(txOptions);

            const ks = lightwallet.keystore.deserialize(user.wallet.serialized);
            const pwDerivedKey = yield Promise.promisify(ks.keyFromPassword).bind(ks)(user._id);

            const valueTx = txutils.valueTx(txOptions);
            const signedValueTx = signing.signTx(ks, pwDerivedKey, valueTx, user.wallet.address);

            const tx = web3.eth.sendRawTransaction(signedValueTx);

            const SmartKTInstance = app.smartKT.getByAddress(loan.address);
            const state = SmartKTInstance.state();

            loan.funding.push({ user_id: data.user_id, amount: data.amount, tx });
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
