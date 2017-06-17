const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function () {
    const app = this;

    app.scoring = {
        score: function(application) {
            return Promise.coroutine(function *() {
                yield Promise.delay(2000);
                app.service('applications').patch(application._id, {status: 'SCORING'});

                yield Promise.delay(5000);
                app.service('applications').patch(application._id, {status: 'ACCEPTED'});
            })();
        }
    }
}