const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'loans.db'),
    autoload: true
  });

  // extending the model
  Model.STATUS = ['SEEDING', 'FUNDING', 'PERFORMING', 'REPAID'];

  return Model;
};
