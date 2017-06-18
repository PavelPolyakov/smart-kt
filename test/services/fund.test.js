const assert = require('assert');
const app = require('../../src/server/app');

describe('\'fund\' service', () => {
  it('registered the service', () => {
    const service = app.service('fund');

    assert.ok(service, 'Registered the service');
  });
});
