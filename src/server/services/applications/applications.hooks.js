const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            function (hook) {
                return Promise.coroutine(function *() {
                    hook.data.user_id = hook.params.user._id;
                    hook.data.status = 'SUBMITTED';

                    const { app } = hook;
                })();

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
            function (hook) {
                const { app } = hook;
                app.scoring.score(hook.result);
            }
        ],
        update: [],
        patch: [
            function (hook) {
                return Promise.coroutine(function *() {
                    // if application was accepted, we need to create a loan and remove the application
                    if (hook.data.status === 'ACCEPTED') {
                        const { app } = hook;
                        const application = hook.result;

                        const user = yield app.service('users').get(application.user_id);
                        // deploying the contract to the blockchain
                        const borrower = user.wallet.address;
                        const FUNDING = application.amountApplied;
                        const PERFORMING = _.toNumber(application.amountApplied) + _.toNumber(app.get('ETHEUR'));

                        const SmartKTInstance = yield app.smartKT.deploy(borrower, FUNDING, PERFORMING);

                        // creating the actual loan
                        yield app.service('loans').create({
                            _id: application._id,
                            address: SmartKTInstance.address,
                            user_id: application.user_id,
                            data: _.pick(application, ['address', '20kDataPoints']),
                            FUNDING,
                            PERFORMING,
                            status: app.loans.STATUS[SmartKTInstance.state()[0]]
                        });

                        // cleaning up the application
                        yield app.service('applications').remove(application._id);
                    }
                })()

            }
        ],
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
