const CronJob = require('cron').CronJob;
const Promise = require('bluebird');
const debug = require('debug')('cron:loans');
const moment = require('moment');
const _ = require('lodash');

module.exports = function (app) {
    const { web3 } = app;

    // watch for the SEEDING applications and seed them
    let seedingJob = new CronJob({
        cronTime: '* * * * * *',
        onTick: function () {
            // setup the inProgressIds variable
            if (!this.inProgressIds) {
                this.inProgressIds = [];
            }
            debug(`SEEDING watcher [${moment().format('YYYY-MM-DD HH:mm:ss')}]`);

            // find SEEDING loans and seed them
            const self = this;
            return Promise.coroutine(function *() {
                let loans = (yield app.service('loans').find({
                    query: {
                        _id: {
                            $nin: self.inProgressIds
                        },
                        'state.status': 'SEEDING'
                    }
                })).data;
                debug(`SEEDING watcher, result: ${loans.length}`);

                // put records in the list of currently processed records
                self.inProgressIds.push(..._.map(loans, '_id'));

                // do scoring
                for (let i = 0; i < loans.length; i++) {
                    const loan = loans[i];
                    yield Promise.delay(5000);

                    const SmartKTInstance = app.smartKT.getByAddress(loan.address);

                    web3.eth.sendTransaction({
                        from: app.get('web3').mainAddress,
                        to: SmartKTInstance.address,
                        value: web3.toWei(_.round(SmartKTInstance.getFundingMilestone().toNumber() / app.get('ETHEUR'), 2), "ether")
                    });

                    // update status
                    const status = app.service('loans').Model.STATUS[SmartKTInstance.state()[0]];
                    yield app.service('loans').patch(loan._id, { 'state.status': status });
                }

                // remove the records from the list of currently processed records
                _.remove(self.inProgressIds, (id) => _.map(loans, '_id').includes(id));
            })();
        },
        start: true,
        runOnInit: true
    });
};