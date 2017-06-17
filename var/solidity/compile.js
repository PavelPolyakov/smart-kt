const fs = require('fs');
const solc = require('solc');

const SmartKTInput = fs.readFileSync(`${process.cwd()}/var/solidity/truffle/contracts/SmartKT.sol`).toString();
SmartKTCompiled = solc.compile(SmartKTInput, 1);
fs.writeFileSync(`${process.cwd()}/var/solidity/compiled/SmartKT.json`, JSON.stringify(SmartKTCompiled));

console.log("Done: SmartKT");
