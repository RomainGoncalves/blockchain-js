const sha256 = require('crypto-js/sha256');
const chunk = require('lodash/chunk');
const helpers = require('./helpers');

class Block {
  constructor({
    chainTransactions = [],
    transactionLimit = 2,
  }) {
    if(chainTransactions.length === 0) throw new Error('There are no transactions in the chain');

    this.hash = '';
    this.chainTransactions = chainTransactions;
    this.transactions = [];
    this.transactionLimit = transactionLimit;
    this.transactionsReady = false;
    this.setTransactions();

    this.header = this.initHeader();
  }

  initHeader() {
    return {
      previousHash: 0,
      miningCompetition: {
        timestamp: new Date().getTime(),
        nounce: 0,
        difficulty: 2,
      },
      merkleRoot: this.createMerkleRoot(),
    }
  }

  setTransactions() {
    this.chainTransactions.forEach(t => {
      // That's for limiting the size of the block. 1Mb for Bitcoin
      if(this.transactions.length === this.transactionLimit) {
        delete this.chainTransactions;
        this.transactionsReady = true;
        return;
      };

      this.transactions.push(t);
    });
  }

  createMerkleRoot() {
    return this.recursive(this.transactions);
  }

  makeChunksAndJoin(transactions) {
    return transactions.length > 1 ? chunk(transactions, 2).map(t => t.join('')) : [];
  }

  recursive(transactions) {
    const newTransactions = transactions.map(
      transaction => helpers.doubleHashing(transaction)
    );

    const chunks = this.makeChunksAndJoin(newTransactions);

    if(chunks.length <= 1) return helpers.doubleHashing(chunks[0]).toString();

    return this.recursive(chunks);
  }

  setPreviousHash(hash) {
    this.header.previousHash = hash;
  }
}

module.exports = Block;
