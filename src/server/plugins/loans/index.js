const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');

module.exports = function () {
    const app = this;
    const {web3} = app;

    app.loans = {
        STATUS: ['SEEDING', 'FUNDING', 'PERFORMING', 'REPAID'],
        seed: function(loan) {
            const self = this;
            return Promise.coroutine(function *() {
                yield Promise.delay(5000);

                const SmartKTInstance = app.smartKT.getByAddress(loan.address);

                web3.eth.sendTransaction({
                    from: app.get('web3').mainAddress,
                    to: SmartKTInstance.address,
                    value: web3.toWei(_.round(SmartKTInstance.getFundingMilestone().toNumber() / app.get('ETHEUR'), 2), "ether")
                });

                // update status
                const status = self.STATUS[SmartKTInstance.state()[0]];
                yield app.service('loans').patch(loan._id, { status });
            })()
        }
    }
}