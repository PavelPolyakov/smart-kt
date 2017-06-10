const Promise = require('bluebird');
const SmartKT = artifacts.require("./SmartKT.sol");
const { web3 } = SmartKT;

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

            console.log('BEFORE:');
            console.log('from: ', accounts[0], web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber(), 'ether'));
            console.log('from: ', accounts[1], web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(), 'ether'));
            console.log('from: ', accounts[2], web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(), 'ether'));

            // SEEDING
            web3.eth.sendTransaction({ from: ownerAddress, to: instance.address, value: web3.toWei(1, "ether") });
            console.log('contract: ', instance.address, web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), 'ether'));

            // FUNDING
            web3.eth.sendTransaction({
                from: accounts[1],
                to: instance.address,
                value: web3.toWei(0.5, "ether"),
                gas: 120000
            });
            web3.eth.sendTransaction({
                from: accounts[2],
                to: instance.address,
                value: web3.toWei(1.5, "ether"),
                gas: 120000
            });

            // PERFORMING
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.25, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(0.5, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(1, "ether") });
            web3.eth.sendTransaction({ from: accounts[0], to: instance.address, value: web3.toWei(1, "ether") });

            console.log('AFTER:');
            console.log('from: ', accounts[0], web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber(), 'ether'));
            console.log('from: ', accounts[1], web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(), 'ether'));
            console.log('from: ', accounts[2], web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(), 'ether'));
            console.log('contract: ', instance.address, web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), 'ether'));
        })()
        // return MetaCoin.deployed().then(function(instance) {
        //     return instance.getBalance.call(accounts[0]);
        // }).then(function(balance) {
        //     assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
        // });
    });
    // it("should call a function that depends on a linked library", function() {
    //     var meta;
    //     var metaCoinBalance;
    //     var metaCoinEthBalance;
    //
    //     return MetaCoin.deployed().then(function(instance) {
    //         meta = instance;
    //         return meta.getBalance.call(accounts[0]);
    //     }).then(function(outCoinBalance) {
    //         metaCoinBalance = outCoinBalance.toNumber();
    //         return meta.getBalanceInEth.call(accounts[0]);
    //     }).then(function(outCoinBalanceEth) {
    //         metaCoinEthBalance = outCoinBalanceEth.toNumber();
    //     }).then(function() {
    //         assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
    //     });
    // });
});
