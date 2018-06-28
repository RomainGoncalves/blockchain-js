const sha256 = require('crypto-js/sha256');
const chunk = require('lodash/chunk');

class Block {
  constructor({
    chainTransactions = [],
    chain,
  }) {
    this.hash = '';
    this.chain = chain;
    this.chainTransactions = chainTransactions;
    this.transactions = [];
    this.transactionLimit = 1;
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
      if(this.transactions.length > this.transactionLimit) {
        delete this.chainTransactions;
        this.transactionsReady = true;
        return;
      };

      this.transactions.push(t);
    });
  }

  createMerkleRoot() {
    console.log(this.transactions);
    if(!this.transactionsReady){
      console.log('EVER HERE');
      this.interval = setInterval(() => {
        this.createMerkleRoot();
        return;
      }, 100);
    }

    clearInterval(this.interval);

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
