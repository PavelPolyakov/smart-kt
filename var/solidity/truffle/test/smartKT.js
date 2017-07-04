const Promise = require('bluebird');
const _ = require('lodash');
const SmartKT = artifacts.require("./SmartKT.sol");
const { web3 } = SmartKT;

// faking enum
const STATUS = ['SEEDING', 'FUNDING', 'PERFORMING', 'REPAID'];

contract('SmartKT', function (accounts) {
    it("successful case", function () {
        return Promise.coroutine(function *() {

            const instance = yield SmartKT.deployed();

            const events = instance.allEvents();
            events.watch(function (error, event) {
                if (!error)
                    console.log(event);
            });

            const ownerAddress = yield instance.owner.call();

            // SEEDING
            assert.equal(STATUS[(yield instance.state.call())[0].toNumber()], 'SEEDING' , 'state.status is not SEEDING');
            const fundingMilestone = yield instance.getFundingMilestone.call();
            const ETHEUR = yield instance.ETHEUR.call();
            const hash = web3.eth.sendTransaction({ from: ownerAddress, to: instance.address, value: web3.toWei(_.round(fundingMilestone/ETHEUR,2), "ether") });

            // FUNDING
            assert.equal(STATUS[(yield instance.state.call())[0].toNumber()], 'FUNDING' , 'state.status is not FUNDING');
            web3.eth.sendTransaction({
                from: accounts[1],
                to: instance.address,
                value: web3.toWei(1.2, "ether"),
                gas: 120000
            });
            web3.eth.sendTransaction({
                from: accounts[2],
                to: instance.address,
                value: web3.toWei(0.8, "ether"),
                gas: 120000
            });

            // PERFORMING
            assert.equal(STATUS[(yield instance.state.call())[0].toNumber()], 'PERFORMING' , 'state.status is not PERFORMING');
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.5, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(1, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(3, "ether") });

            // REPAID
            assert.equal(STATUS[(yield instance.state.call())[0].toNumber()], 'REPAID' , 'state.status is not REPAID');
            assert.equal(web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), 'ether'), 0 , 'Contract wasn\'t flushed');
        })()
    });
});
