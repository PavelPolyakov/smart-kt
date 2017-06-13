const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const auth = require('feathers-authentication');

const Promise = require('bluebird');

const SECRET = 'secret';

module.exports = function () {
  const app = this;

  // authentication block
  app.configure(auth({
    secret: SECRET,
    cookie: { enabled: true, secure: false, domain: 'localhost' },
    jwt: { audience: 'http://localhost' }
  }));
  app.configure(local({
    usernameField: '_id'
  }));
  app.configure(jwt());

  // authentication specific
  app.service('authentication').hooks({
    before: {
      create: [
        // You can chain multiple strategies
        auth.hooks.authenticate(['jwt', 'local']),
      ],
      remove: [
        auth.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: [
        function(hook) {
        }
      ],
      remove: [
          /**
           * Cleaning up the user who had logged out
           * @param hook
           * @returns {*}
           */
        // function (hook) {
        //   return Promise.coroutine(function *() {
        //     const data = yield app.passport.verifyJWT(hook.id, { secret: app.passport.options('jwt').secret });
        //     // cleaning up the user record
        //     yield app.service('users').remove(data.userId);
        //     return hook;
        //   })();
        // }
      ]
    }
  });
};