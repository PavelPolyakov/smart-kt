const local = require('feathers-authentication-local');
const auth = require('feathers-authentication');
const { iff, paramsFromClient, pluck } = require('feathers-hooks-common');
const _ = require('lodash');
const Promise = require('bluebird');

const lightwallet = require('eth-lightwallet');

module.exports = {
    before: {
        all: [],
        find: [
            paramsFromClient('lookup'),
            // pass through the lookup query
            iff(
                (hook) => {
                    return !(hook.params.lookup && !_.isEmpty(hook.params.query));
                },
                auth.hooks.authenticate('jwt')
            )
        ],
        get: [
            paramsFromClient('frontEnd')
        ],
        create: [
            /**
             * Add default password
             * @param hook
             */
                function (hook) {
                hook.data.password = hook.data.username;
            },
            local.hooks.hashPassword({ passwordField: 'password' }),
        ],
        update: [],
        patch: [
            function (hook) {
                return Promise.coroutine(function *() {
                    const { app } = hook;
                    const { web3 } = app;

                    // in case ETH is going to be updated, recalculate to EUR
                    if (_.has(hook.data, 'wallet.balance.ETH')) {
                        hook.data['wallet.balance'] = {
                            ETH: hook.data['wallet.balance.ETH'],
                            EUR: _.ceil(web3.fromWei(hook.data['wallet.balance.ETH'], 'ether') * app.get('ETHEUR'))
                        }

                        delete hook.data['wallet.balance.ETH'];
                    }
                })()
            }
        ],
        remove: []
    },

    after: {
        all: [],
        find: [
            iff(
                (hook) => hook.params.lookup,
                pluck('_id', 'username')
            )
        ],
        get: [
            function (hook) {
                // query from the front-end side
                if (hook.params.frontEnd === true) {
                    // password and private part of the wallet should not be accessible from the front-end
                    delete hook.result.password;
                    if (_.has(hook.result, 'wallet')) {
                        hook.result.wallet = _.pick(hook.result.wallet, ['address', 'balance'])
                    }
                }
            }
        ],
        create: [
            // create the wallet and store it
            function (hook) {
                return Promise.coroutine(function *() {
                    const { app } = hook;
                    const { web3 } = app;

                    // generate a new BIP32 12-word seed
                    const seed = lightwallet.keystore.generateRandomSeed();
                    const password = hook.result._id;
                    const keyStore = yield Promise.promisify(lightwallet.keystore.createVault).bind(lightwallet.keystore)({
                        password,
                        seed
                    });
                    const pwDerivedKey = yield Promise.promisify(keyStore.keyFromPassword).bind(keyStore)(password);
                    keyStore.generateNewAddress(pwDerivedKey);
                    const address = `0x${_.first(keyStore.getAddresses())}`;
                    const privateKey = keyStore.exportPrivateKey(address, pwDerivedKey)
                    const serialized = keyStore.serialize();

                    yield hook.service.patch(hook.result._id, {
                        wallet: {
                            seed,
                            address,
                            privateKey,
                            serialized,
                            balance: 0
                        }
                    });

                    // transfer a bonus of 1 ETH
                    web3.eth.sendTransaction({
                        from: hook.app.get('web3').mainAddress,
                        to: address,
                        value: web3.toWei(2, 'ether')
                    });

                    yield hook.service.patch(hook.result._id, {
                        'wallet.balance': {
                            'ETH': web3.eth.getBalance(address).toNumber(),
                            'EUR': _.ceil(web3.fromWei(web3.eth.getBalance(address).toNumber(), 'ether') * app.get('ETHEUR'))
                        }
                    });
                })()
            }
        ],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
