module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            function (hook) {
                // adding the
                hook.data.user_id = hook.params.user._id;
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
