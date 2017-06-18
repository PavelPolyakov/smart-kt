const assert = require('assert');
const app = require('../../src/server/app');

describe('\'repay\' service', () => {
  it('registered the service', () => {
    const service = app.service('repay');

    assert.ok(service, 'Registered the service');
  });
});
