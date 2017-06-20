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

            // const rawTx = {
            //     to: loan.address,
            //     value: web3.toWei(data.amount / app.get('ETHEUR'), 'ether'),
            //     gas: 120000
            // };
            //
            // console.log('raw transaction', rawTx);
            //
            // const tx = new Tx(rawTx);
            // tx.sign(new Buffer(user.wallet.privateKey, 'hex'));
            // const serializedTx = tx.serialize();

            const txOptions = {
                to: loan.address,
                value: web3.toWei(data.amount / app.get('ETHEUR'), 'ether'),
                gas: 120000
            };

            const ks = lightwallet.keystore.deserialize(user.wallet.serialized);
            const pwDerivedKey = yield Promise.promisify(ks.keyFromPassword).bind(ks)(user._id);

            const valueTx = txutils.valueTx(txOptions);
            const signedValueTx = signing.signTx(ks, pwDerivedKey, valueTx, user.wallet.address);

            web3.eth.sendRawTransaction(signedValueTx);

            loan.funding.push({ user_id: data.user_id, amount: data.amount });
            yield app.service('loans').patch(loan._id, { 'funding': loan.funding });
            yield app.service('users').patch(user._id, { 'wallet.balance.ETH': web3.getBalance(user.wallet.address).toNumber() });

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
