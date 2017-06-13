const assert = require('assert');
const app = require('../../src/server/app');

describe('\'loans\' service', () => {
  it('registered the service', () => {
    const service = app.service('loans');

    assert.ok(service, 'Registered the service');
  });
});
