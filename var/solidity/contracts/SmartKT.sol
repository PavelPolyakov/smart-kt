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
            if (msg.sender != owner || msg.value != 1 ether) {
                throw;
            }
            // switching to the next phase
            state.status = STATUS.FUNDING;
            state.balance = 0;
            return;
        }

        // handling the FUNDING phase
        if (state.status == STATUS.FUNDING) {
            // calculating portions to issue
            uint portionsToFund = ETHEUR * msg.value / uint(1000000000000000000);

            // error, in case there is nothing fo fund
            if (portionsToFund == 0) {
                Exception('Error: portionsToFund is 0');
                throw;
            }

            // error, in case the number is too big
            if (portionsToFund + state.balance > milestones[uint(STATUS.FUNDING)]) {
                Exception('Error: we are going to exceed the funding, not good');
                throw;
            }

            state.balance += portionsToFund;
            balances[msg.sender] += portionsToFund;
            Log('hello', 1);
            balancesIndex.push(msg.sender);

            // switching to the next phase
            if (state.balance == milestones[uint(STATUS.FUNDING)]) {
                // transfer the money to the borrower
                borrower.transfer(milestones[uint(STATUS.FUNDING)] * uint(1000000000000000000) / ETHEUR);

                state.status = STATUS.PERFORMING;
                state.balance = 0;
            }
            return;
        }

        // handling the PERFORMING phase
        if (state.status == STATUS.PERFORMING) {
            uint portionsBoughtBack = ETHEUR * msg.value / uint(1000000000000000000);
            //Log('portionsBoughtBack', portionsBoughtBack);

            // error, in case there is nothing fo fund
            if (portionsBoughtBack == 0) {
                Exception('Error: portionsBoughtBack is 0');
                throw;
            }

            // error, in case the number is too big
            if (portionsBoughtBack + state.balance > milestones[uint(STATUS.PERFORMING)]) {
                Exception('Error: we are going repay more then needed, not good');
                throw;
            }

            state.balance += portionsBoughtBack;

            // paying back to our debtors
            for (uint i = 0; i < balancesIndex.length; i++) {
                balancesIndex[i].transfer(msg.value * balances[balancesIndex[i]] / milestones[uint(STATUS.FUNDING)]);
            }

            // check if the loan is fully repaid
            if(state.balance == milestones[uint(STATUS.PERFORMING)]) {
                state.status = STATUS.REPAID;
                state.balance = 0;

                Log('remaining', this.balance);
                // pay everything back to the owner
                owner.transfer(this.balance);
            }

            return;
        }

        if(state.status == STATUS.REPAID) {
            throw;
        }
    }

}
