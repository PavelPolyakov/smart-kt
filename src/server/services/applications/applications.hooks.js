const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            function (hook) {
                return Promise.coroutine(function *() {
                    hook.data.user_id = hook.params.user._id;
                    hook.data.status = 'SUBMITTED';

                    const { app } = hook;
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
        create: [],
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
