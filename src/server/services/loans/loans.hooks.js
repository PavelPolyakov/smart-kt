const Promise = require('bluebird');

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            function (hook) {
                console.log(hook);
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
            function (hook) {
                return Promise.coroutine(function *() {
                    const { app, service } = hook;

                    // seed in case we need to seed this loan
                    if (hook.result.status === 'SEEDING') {
                        app.loans.seed(hook.result);
                    }
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
