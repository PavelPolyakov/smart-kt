const local = require('feathers-authentication-local');
const auth = require('feathers-authentication');
const { iff, paramsFromClient, pluck } = require('feathers-hooks-common');
const _ = require('lodash');

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
      local.hooks.hashPassword({ passwordField: 'password' })
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
