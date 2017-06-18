// Initializes the `repay` service on path `/repay`
const createService = require('./repay.class.js');
const hooks = require('./repay.hooks');
const filters = require('./repay.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'repay',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/repay', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('repay');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
