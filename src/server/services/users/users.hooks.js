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
        get: [],
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
        patch: [],
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
                // password and private part of the wallet should not be accessible from the front-end
                delete hook.result.password;
                if(_.has(hook.result, 'wallet')) {
                    hook.result.wallet = { address: hook.result.wallet.address }
                }
            }
        ],
        create: [
            // create the wallet and store it
            function (hook) {
                return Promise.coroutine(function *() {
                    const { web3 } = hook.app;

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

                    yield hook.service.patch(hook.result._id, { wallet: { seed, address, privateKey, serialized } });

                    // transfer a bonus of 1 ETH
                    web3.eth.sendTransaction({
                        from: hook.app.get('web3').mainAddress,
                        to: address,
                        value: web3.toWei(1, 'ether')
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
