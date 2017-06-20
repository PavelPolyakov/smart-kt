pragma solidity ^0.4.4;

contract SmartKT {
    event Log(string log, uint arg);

    event Exception(string error);

    enum STATUS {SEEDING, FUNDING, PERFORMING, REPAID}

    struct State {
    STATUS status;
    uint balance;
    }

    State public state;

    mapping (address => uint) public balances;

    address[] balancesIndex;

    mapping (uint => uint) milestones;

    address public owner = msg.sender;

    uint public stateBalance;

    uint public ETHEUR;

    address public borrower; // address of the borrower

    modifier onlyBy(address _account)
    {
        require(msg.sender == _account);
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }

    function SmartKT(uint _ETHEUR, address _borrower, uint _FUNDING, uint _PERFORMING) {
        // constructor
        owner = msg.sender;
        state.status = STATUS.SEEDING;
        state.balance = 0;
        ETHEUR = _ETHEUR;
        borrower = _borrower;
        milestones[uint(STATUS.FUNDING)] = _FUNDING;
        milestones[uint(STATUS.PERFORMING)] = _PERFORMING;
    }

    function getFundingMilestone() public constant returns (uint) {
        return milestones[uint(STATUS.FUNDING)];
    }

    function getPerformingMilestone() public constant returns (uint) {
        return milestones[uint(STATUS.PERFORMING)];
    }

    function getBalance(address addr) public constant returns (uint) {
        return balances[addr];
    }

    function updateETHEUR(uint _ETHEUR) onlyBy(owner) {
        ETHEUR = _ETHEUR;
    }

    function() payable {
        // handling the SEEDING phase
        if (state.status == STATUS.SEEDING) {
            if (msg.sender != owner || msg.value != (milestones[uint(STATUS.FUNDING)] * 1 ether /*uint(1000000000000000000)*/ / ETHEUR)) {
                throw;
            }
            // switching to the next phase
            state.status = STATUS.FUNDING;
            state.balance = 0;
            return;
        }

        // handling the FUNDING phase
        if (state.status == STATUS.FUNDING) {
            // calculating cents to issue
            uint centsToFund = ETHEUR * msg.value / 1 ether;

            // error, in case there is nothing fo fund
            if (centsToFund == 0) {
                Exception('Error: centsToFund is 0');
                throw;
            }

            // in case the number is too big
            if (centsToFund + state.balance > milestones[uint(STATUS.FUNDING)]) {
                centsToFund = milestones[uint(STATUS.FUNDING)] - state.balance;
                // sending back the extra money
                msg.sender.transfer(msg.value - (centsToFund * 1 ether / ETHEUR));
            }

            state.balance += centsToFund;

            // push to index, in case there is no such mapping record
            if(balances[msg.sender] == uint(0)) {
                balancesIndex.push(msg.sender);
            }
            // add cents to balance
            balances[msg.sender] += centsToFund;

            // switching to the next phase
            if (state.balance == milestones[uint(STATUS.FUNDING)]) {
                // transfer the money to the borrower
                borrower.transfer(milestones[uint(STATUS.FUNDING)] * 1 ether / ETHEUR);

                state.status = STATUS.PERFORMING;
                state.balance = 0;
            }
            return;
        }

        // handling the PERFORMING phase
        if (state.status == STATUS.PERFORMING) {
            uint centsToBuyBack = ETHEUR * msg.value / 1 ether;

            // error, in case there is nothing fo fund
            if (centsToBuyBack == 0) {
                Exception('Error: centsToBuyBack are 0');
                throw;
            }

            // error, in case the number is too big
            if (centsToBuyBack + state.balance > milestones[uint(STATUS.PERFORMING)]) {
                centsToBuyBack = milestones[uint(STATUS.PERFORMING)] - state.balance;
                // sending back the extra money
                msg.sender.transfer(msg.value - (centsToBuyBack * 1 ether / ETHEUR));
            }

            state.balance += centsToBuyBack;

            // paying back to our debtors
            for (uint i = 0; i < balancesIndex.length; i++) {
                balancesIndex[i].transfer(msg.value * balances[balancesIndex[i]] / milestones[uint(STATUS.FUNDING)]);
            }

            // check if the loan is fully repaid
            if (state.balance == milestones[uint(STATUS.PERFORMING)]) {
                state.status = STATUS.REPAID;
                state.balance = 0;
                // pay everything back to the owner
                owner.transfer(this.balance);
            }

            return;
        }

        if (state.status == STATUS.REPAID) {
            throw;
        }
    }

}
