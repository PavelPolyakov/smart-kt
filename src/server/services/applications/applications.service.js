// Initializes the `applications` service on path `/applications`
const createService = require('feathers-nedb');
const createModel = require('../../models/applications.model');
const hooks = require('./applications.hooks');
const filters = require('./applications.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'applications',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/applications', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('applications');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }

};
