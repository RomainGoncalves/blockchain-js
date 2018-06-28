const sha256 = require('crypto-js/sha256');
const chunk = require('lodash/chunk');

class Block {
  constructor({
    chainTransactions = [],
  }) {
    this.hash = '';
    this.chainTransactions = chainTransactions;
    this.transactions = [];
    this.transactionLimit = 1;
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
      if(this.transactions.length > this.transactionLimit) {
        delete this.chainTransactions;
        return;
      };

      this.transactions.push(t);
      this.chainTransactions.shift(0, 0);
    });
  }

  createMerkleRoot() {
    return this.recursive(this.transactions);
  }

  recursive(transactions) {
    const newTransactions = transactions.map(
      transaction => sha256(JSON.stringify(transaction)).toString()
    );

    const chunks = newTransactions.length > 1 ? chunk(newTransactions, 2).map(t => t.join('')) : [];

    if(chunks.length <= 1) return sha256(chunks).toString();

    return this.recursive(chunks);
  }

  setPreviousHash(hash) {
    this.header.previousHash = hash;
  }
}
//
// console.log(
//   new Block({})
// );

module.exports = Block;
