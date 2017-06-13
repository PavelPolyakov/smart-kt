// Initializes the `loans` service on path `/loans`
const createService = require('feathers-nedb');
const createModel = require('../../models/loans.model');
const hooks = require('./loans.hooks');
const filters = require('./loans.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'loans',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/loans', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('loans');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
