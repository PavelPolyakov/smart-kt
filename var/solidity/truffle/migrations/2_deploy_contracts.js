var SmartKT = artifacts.require("./SmartKT.sol");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(SmartKT, /** ETHEUR (in cents) **/ 25000 ,
        /** borrower **/ accounts[0],
        /** FUNDING **/ 50000,
        /** PERFORMING **/ 65000);
};
