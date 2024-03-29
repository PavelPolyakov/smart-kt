const authentication = require('./authentication');
const users = require('./users/users.service.js');
const loans = require('./loans/loans.service.js');
const applications = require('./applications/applications.service.js');
const fund = require('./fund/fund.service.js');
const repay = require('./repay/repay.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(authentication);
  app.configure(users);
  app.configure(loans);
  app.configure(applications);
  app.configure(fund);
  app.configure(repay);
};
