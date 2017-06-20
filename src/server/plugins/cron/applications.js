const CronJob = require('cron').CronJob;
const Promise = require('bluebird');
const debug = require('debug')('cron:applications');
const moment = require('moment');
const _ = require('lodash');

module.exports = function (app) {
    // watch for the SUBMITTED applications and score them
    let submittedJob = new CronJob({
        cronTime: '* * * * * *',
        onTick: function () {
            // setup the inProgressIds variable
            if (!this.inProgressIds) {
                this.inProgressIds = [];
            }

            debug(`SUBMITTED watcher [${moment().format('YYYY-MM-DD HH:mm:ss')}]`);

            // find SUBMITTED applications
            const self = this;
            return Promise.coroutine(function *() {
                debug(`Query`, JSON.stringify({
                    _id: {
                        $nin: self.inProgressIds
                    },
                    status: 'SUBMITTED'
                }));

                let applications = (yield app.service('applications').find({
                    query: {
                        _id: {
                            $nin: self.inProgressIds
                        },
                        status: 'SUBMITTED'
                    }
                })).data;
                debug(`SUBMITTED watcher, result: ${applications.length}, running: ${submittedJob.running}`);

                // put records in the list of currently processed records
                self.inProgressIds.push(..._.map(applications, '_id'));

                // do scoring
                for (let i = 0; i < applications.length; i++) {
                    const application = applications[i];
                    debug(`trying to score the app ${JSON.stringify(application)}`);
                    yield Promise.delay(2000);
                    app.service('applications').patch(application._id, { status: 'SCORING' });

                    yield Promise.delay(5000);
                    app.service('applications').patch(application._id, { status: 'ACCEPTED' });
                }

                // remove the records from the list of currently processed records
                _.remove(self.inProgressIds, (id) => _.map(applications, '_id').includes(id));
            })();
        },
        start: true,
        runOnInit: true
    });

    // watch for the ACCEPTED applications, deploy the contract and convert them to the loan
    let acceptedJob = new CronJob({
        cronTime: '* * * * * *',
        onTick: function () {
            // setup the inProgressIds variable
            if (!this.inProgressIds) {
                this.inProgressIds = [];
            }

            debug(`ACCEPTED watcher [${moment().format('YYYY-MM-DD HH:mm:ss')}]`);

            // find SUBMITTED applications
            const self = this;
            return Promise.coroutine(function *() {
                let applications = (yield app.service('applications').find({
                    query: {
                        _id: {
                            $nin: self.inProgressIds
                        },
                        status: 'ACCEPTED'
                    }
                })).data;
                debug(`ACCEPTED watcher, result: ${applications.length}`);

                // put records in the list of currently processed records
                self.inProgressIds.push(..._.map(applications, '_id'));

                // do scoring
                for (let i = 0; i < applications.length; i++) {
                    const application = applications[i];
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
                        funding: [],
                        repayment: [],
                        milestones: {
                            FUNDING,
                            PERFORMING
                        },
                        state: {
                            status: app.service('loans').Model.STATUS[SmartKTInstance.state()[0]],
                            balance: 0
                        }
                    });

                    // cleaning up the application
                    yield app.service('applications').remove(application._id);
                }

                // remove the records from the list of currently processed records
                _.remove(self.inProgressIds, (id) => _.map(applications, '_id').includes(id));
            })();
        },
        start: true,
        runOnInit: true
    });
};