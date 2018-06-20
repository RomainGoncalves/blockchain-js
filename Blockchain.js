const sha256 = require('crypto-js/sha256');

const Miner = require('./Miner');

class Blockchain {
  constructor({ difficulty = 2}) {
    this.chain = [];
    this.difficulty = difficulty;
  }

  addBlock(block) {
    if(this.validateBlock(block)) {
      this.chain.push(block);
    }
  }

  async mineBlock(block) {
    block.setPreviousHash(this.findPreviousHash());

    const miner = new Miner(block, this.difficulty);
    await miner.generateHash();

    this.addBlock(miner.block);
  }

  validateBlock(block) {
    const previousHash = this.findPreviousHash();
    const blockHash = this.calculateBlockHash(block);

    if (
      (previousHash === block.header.previousHash) &&
      (blockHash === block.hash)
    ) return true;

    console.log('Something went wrong with this block: ', block);

    return false
  }

  calculateBlockHash(block) {
    const message = JSON.stringify(block.header);
    const hash = sha256(message).toString();

    return hash;
  }

  findPreviousHash() {
    const lastBlock = this.chain[this.chain.length -1];

    if(lastBlock !== undefined) return lastBlock.hash;

    return 0;
  }
}

module.exports = Blockchain;
