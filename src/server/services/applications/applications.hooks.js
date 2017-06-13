

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
        function(hook) {
            console.log(hook);
        }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
        function(hook) {
            console.log(hook);
        }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
