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

            var events = instance.allEvents();

            events.watch(function (error, event) {
                if (!error)
                    console.log(event);
            });

            const ownerAddress = yield instance.owner.call();

            console.log(STATUS[(yield instance.state.call())[0].toNumber()]);

            console.log('BEFORE:');
            console.log('STATUS:', STATUS[(yield instance.state.call())[0].toNumber()]);
            console.log('ownerAddress:', ownerAddress);
            console.log('from: ', accounts[0], web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber(), 'ether'));
            console.log('from: ', accounts[1], web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(), 'ether'));
            console.log('from: ', accounts[2], web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(), 'ether'));

            // SEEDING
            const fundingMilestone = yield instance.getFundingMilestone.call();
            const ETHEUR = yield instance.ETHEUR.call();
            const thash = web3.eth.sendTransaction({ from: ownerAddress, to: instance.address, value: web3.toWei(_.round(fundingMilestone/ETHEUR,2), "ether") });

            // FUNDING
            console.log('STATUS:', STATUS[(yield instance.state.call())[0].toNumber()]);
            web3.eth.sendTransaction({
                from: accounts[1],
                to: instance.address,
                value: web3.toWei(0.2, "ether"),
                gas: 120000
            });
            web3.eth.sendTransaction({
                from: accounts[2],
                to: instance.address,
                value: web3.toWei(2.75, "ether"),
                gas: 120000
            });

            // PERFORMING
            console.log('STATUS:', STATUS[(yield instance.state.call())[0].toNumber()]);
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.5, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(1, "ether") });
            try {
                web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(3, "ether") });
            } catch(error) {
                console.log(error);
            }

            console.log('AFTER:');
            console.log('STATUS:', STATUS[(yield instance.state.call())[0].toNumber()]);
            console.log('from: ', accounts[0], web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber(), 'ether'));
            console.log('from: ', accounts[1], web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(), 'ether'));
            console.log('from: ', accounts[2], web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(), 'ether'));
            console.log('contract: ', instance.address, web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), 'ether'));

        })()
    });
});
