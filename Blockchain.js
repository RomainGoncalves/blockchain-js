const sha256 = require('crypto-js/sha256');
const remove = require('lodash/remove');

const Block = require('./Block');
const Miner = require('./Miner');
const Transaction = require('./Transaction');

class Blockchain {
  constructor({ difficulty = 2, transactionLimit = 2 }) {
    this.blocks = [];
    this.transactions = [];
    this.candidateBlocks = [];
    this.busy = false;
    this.interval;
    this.difficulty = difficulty;
    this.transactionLimit = transactionLimit;
  }

  addCandidateBlock(block) {
    var found = this.candidateBlocks.find(
      b => b.header.merkleRoot === block.header.merkleRoot
    )

    if(!found){
      console.log('Adding candidate block...');
      this.candidateBlocks.push(block);
    }
  }

  addBlock(block) {
    const promise = new Promise(resolve => {
      if(this.validateBlock(block)) {
        this.removeCandidateBlock(block);
        this.removeTransactions(block);

        this.blocks.push(block);
        console.log('Added block');
        resolve();
      }
    });

    return promise;
  }

  isSameBlock(candidateBlock, block) {
    return candidateBlock.header.miningCompetition.timestamp === block.header.miningCompetition.timestamp
  }

  removeCandidateBlock(block) {
    remove(
      this.candidateBlocks,
      b => this.isSameBlock(b, block)
    );
  }

  removeTransactions(block) {
    block.transactions.forEach(transaction =>
    remove(
      this.transactions,
      t => t.amount === transaction.amount,
    ));
    console.log('Transactions removed...', this.transactions);
  }

  createTransaction(transaction) {
    if (transaction instanceof Transaction) this.transactions.push(transaction);
  }

  createBlock() {
    const block = new Block({
      chainTransactions: this.transactions,
      transactionLimit: this.transactionLimit,
    });
    this.addCandidateBlock(block);
  }

  mineBlock() {
    const block = this.candidateBlocks[0];

    if(this.busy) {
      this.interval = setInterval(() => {
        this.mineBlock(block);
      }, 100);
      return;
    }

    clearInterval(this.interval);

    block.setPreviousHash(this.findPreviousHash());

    const miner = new Miner(block, this.difficulty);

    console.log('Waiting for miner....');

    this.busy = true;

    miner.generateHash().then(() => {
      console.log('Waiting to add block to chain...');
      this.addBlock(miner.block).then(() => {this.busy = false;});
    });
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
    const hash = sha256(sha256(message)).toString();

    return hash;
  }

  findPreviousHash() {
    const lastBlock = this.blocks[this.blocks.length -1];

    if(lastBlock !== undefined) return lastBlock.hash;

    return 0;
  }
}

module.exports = Blockchain;
