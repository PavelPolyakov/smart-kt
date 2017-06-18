// Initializes the `fund` service on path `/fund`
const createService = require('./fund.class.js');
const hooks = require('./fund.hooks');
const filters = require('./fund.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'fund',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fund', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('fund');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
