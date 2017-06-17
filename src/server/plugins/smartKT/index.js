const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');

module.exports = function () {
    const app = this;
    const {web3} = app;

    // preparation
    const SmartKTCompiled = JSON.parse(fs.readFileSync(`${process.cwd()}/var/solidity/compiled/SmartKT.json`));
    const bytecode = SmartKTCompiled.contracts[':SmartKT'].bytecode;
    const abi = JSON.parse(SmartKTCompiled.contracts[':SmartKT'].interface);

    const SmartKT = web3.eth.contract(abi);

    app.smartKT = {
        deploy: function(borrower, FUNDING, PERFORMING) {
            const self = this;
            return Promise.coroutine(function *() {
                const SmartKTDeployed = SmartKT.new(/** ETHEUR (in cents) **/ app.get('ETHEUR') ,
                    /** borrower **/ borrower,
                    /** FUNDING **/ FUNDING,
                    /** PERFORMING **/ PERFORMING, {
                        data: '0x' + bytecode,
                        from: app.get('web3').mainAddress,
                        gas: 90000*10
                    });

                yield new Promise((resolve, reject) => {
                    let i = 0;
                    const waitingInterval = setInterval(() => {
                        i++;
                        if(SmartKTDeployed.address) {
                            clearInterval(waitingInterval);
                            resolve();
                        }
                    });
                });

                const SmartKTInstance = SmartKT.at(SmartKTDeployed.address);

                return SmartKTInstance;
            })();
        },
        getByAddress: function(address) {
            const SmartKTInstance = SmartKT.at(address);
            return SmartKTInstance;
        },
        seed: function(address) {
            const self = this;
            return Promise.coroutine(function *() {
                yield Promise.delay(5000);

                const SmartKTInstance = self.getByAddress(address);

                web3.eth.sendTransaction({
                    from: app.get('web3').mainAddress,
                    to: SmartKTInstance.address,
                    value: web3.toWei(_.round(SmartKTInstance.getFundingMilestone().toNumber() / app.get('ETHEUR'), 2), "ether")
                });

                return true;
            })()
        }
    }
}