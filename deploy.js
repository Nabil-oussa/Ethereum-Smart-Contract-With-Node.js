/* COMPILE AND DEPLOY CONTRACT */
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('Web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'kite traffic pool visit master property drastic spatial final uncover deposit soldier'; 
const providerOrUrl = 'https://rinkeby.infura.io/v3/9decca633394472bb3a0f48b8c3a507e';

const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
const web3 = new Web3(provider);
const content = fs.readFileSync('./MyContract.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
      'MyContract.sol': { content }
    },
    settings: {
      outputSelection: { '*': { '*': ['*'] } }
    }
  };

  async function deploy (){
    /* 1. Get Ethereum Account */
    const [account] = await web3.eth.getAccounts();
  
    /* 2. Compile Smart Contract */
    const {contracts} = JSON.parse(
      solc.compile(JSON.stringify(input))
    );
  
    const contract = contracts['MyContract.sol'].MyContract;
  
    /* 2. Extract Abi And Bytecode From Contract */
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
  
    /* 3. Send Smart Contract To Blockchain */
    const { _address } = await new web3.eth.Contract(abi)
      .deploy({ data: bytecode })
      .send({from: account, gas: 1000000 });
  
    console.log("Contract Address =>", _address);
  };
  
  deploy();