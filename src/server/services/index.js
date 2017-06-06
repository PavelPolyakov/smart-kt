const authentication = require('./authentication');
const users = require('./users/users.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(authentication);
  app.configure(users);
};
