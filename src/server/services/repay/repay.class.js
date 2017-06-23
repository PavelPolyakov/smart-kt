const Promise = require('bluebird');
const _ = require('lodash');
const Tx = require('ethereumjs-tx');

const lightwallet = require('eth-lightwallet');
const { txutils, signing } = lightwallet;

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

            loan.repayment.push({ user_id: data.user_id, amount: data.amount, hash });
            yield app.service('loans').patch(loan._id, {
                'repayment': loan.repayment, 'state': {
                    status: app.service('loans').Model.STATUS[state[0]],
                    balance: state[1].toNumber()
                }
            });
            yield app.service('users').patch(user._id, { 'wallet.balance.ETH': web3.eth.getBalance(user.wallet.address).toNumber() });

            // update balance for the users who funded this loan
            const fundersIds = _.uniq(_.map(loan.funding, 'user_id'));
            const funders = (yield app.service('users').find({
                query: {
                    _id: {
                        $in: fundersIds
                    }
                }
            })).data;

            for (let i = 0; i < funders.length; i++) {
                const funder = funders[i];
                yield app.service('users').patch(funder._id, { 'wallet.balance.ETH': web3.eth.getBalance(funder.wallet.address).toNumber() });
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
