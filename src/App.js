import React, { Component } from 'react';
import Web3 from 'web3';

import classes from './App.module.css';
import Block from './components/Block';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      data: [], 
      blockNumber: 0, 
      blocks: [], 
      recency: [
        'The current block is',
        'The previous block was',
        'Two blocks ago was',
        'Three blocks ago was',
        'Four blocks ago was',
        'Five blocks ago was',
        'Six blocks ago was',
        'Seven blocks ago was',
        'Eight blocks ago was',
        'Nine blocks ago was',
      ],
      miners: {
        "0x829bd824b016326a401d083b33d092293333a830": "F2Pool 2",
        "0x2a5994b501e6a560e727b6c2de5d856396aadd38": "PandaMiner",
        "0x04668ec2f57cc15c381b461b9fedab5d451c8f7f": "zhizhu.top",
        "0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c": "SparkPool",
        "0xea674fdde714fd979de3edf0f56aa9716b898ec8": "Ethermine",
        "0x005e288d713a5fb3d7c9cf1b43810a98688c7223": "xnpool",
        "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5": "Nanopool",
        "0x2a65aca4d5fc5b5c859090a6c34d164135398226": "DwarfPool 1",
        "0x6a7a43be33ba930fe58f34e07d0ad6ba7adb9b1f": "Coinotron 3",
        "0xb2930b35844a230f00e51431acae96fe543a0347": "MiningPoolHub",
        "0x4c549990a7ef3fea8784406c1eecc98bf4211fa5": "Hiveon",
        "0x06b8c5883ec71bc3f4b332081519f23834c8706e": "Mining Express",
        "0x35f61dfb08ada13eba64bf156b80df3d5b3a738d": "firepool",
        "0x52e44f279f4203dcf680395379e5f9990a69f13c": "bw"
      }
    };
  }

  componentWillMount () {
    // Post EIP-1102 update which MetaMask no longer injects web3
    if (window.ethereum) {
      // Use MetaMask provider
      window.web3 = new Web3(window.ethereum);
    } 
    // Legacy dApp browsers which web3 is still being injected
    if (typeof window.web3 !== 'undefined') {
      // Use injected provider
      window.web3 = new Web3(window.web3.currentProvider);
    }
    window.web3.eth.getBlockNumber().then(this.setBlockNumber);
  }

  setBlockNumber = res => {
    this.setState({ blockNumber: res });
  }

  componentDidMount () {
    this.getBlocks();
  }

  getBlocks = () => {
    window.web3.eth.getBlockNumber().then( async (num) => {
      let blocks = []
      for (let i=0; i < 10; i++) {
        let blockNumber = num - i
        blocks.push(blockNumber);
      }

      // get block data
      const blocksData = [];
      async function getBlockData(blockNumber) {
        const blockData = await window.web3.eth.getBlock(blockNumber)
          .then((newBlock) => {
            blocksData.push(newBlock);
          })
          .catch((error) => console.log(error));
          }
      await Promise.all(blocks.map(getBlockData));
      blocksData.sort((a, b) => (b.number > a.number) ? 1 : -1)

      // set the miner's name
      for (let i=0; i < blocksData.length; i++) {
        const block = blocksData[i]
        if (block.miner.toLowerCase() in this.state.miners) {
          block.minerName = this.state.miners[block.miner.toLowerCase()]
        }
        else {
          block.minerName = "unknown address"
        }
      }

      this.setState({ blocks: blocksData })
    })
  }

  render() {

    return (
      <div className={classes.App}>
        <header className={classes.Header}>
            <h2>The current block number is: {this.state.blockNumber}</h2>
            <div>
              {this.state.blocks.map((block, index) => {
                
                return (
                  <Block 
                    blockNumber={block.number} 
                    key={block.number} 
                    recency={this.state.recency[index]}
                    gasUsed={block.gasUsed}
                    gasLimit={block.gasLimit}
                    miner={block.minerName}
                    transactions={block.transactions.length}
                  />
                );
              })}
            </div>
        </header>
      </div>
    );
  }
}

export default App;
