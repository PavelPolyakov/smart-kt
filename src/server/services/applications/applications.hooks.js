const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
        function(hook) {
            return Promise.coroutine(function *() {
                hook.data.user_id = hook.params.user._id;
                const {app} = hook;

                yield app.service('users').patch(hook.params.user._id, { 'wallet.balance.ETH': _.random(1,10) * 500000000000000000});
            })();

        }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
        function(hook) {
            console.log(hook);
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
