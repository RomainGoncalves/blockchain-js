const sha256 = require('crypto-js/sha256');
const chunk = require('lodash/chunk');

class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
    this.hash = '';
    this.transactions = [
      { amount: 1 }, { amount: 2 }, { amount: 3 }, { amount: 4 },
      { amount: 5 }, { amount: 6 },
    ];
    this.header = this.createHeader();
  }

  createHeader() {
    return {
      previousHash: '',
      miningCompetition: {
        timestamp: new Date().getTime(),
        nounce: 0,
        difficulty: 2,
      },
      merkleRoot: this.createMerkleRoot()
    }
  }

  createMerkleRoot() {
    return this.recursive(this.transactions);
  }

  recursive(transactions) {
    const newTransactions = transactions.map(
      transaction => sha256(JSON.stringify(transaction)).toString()
    );

    const chunks = chunk(newTransactions, 2).map(t => t.join(''));

    if(chunks.length === 1) return sha256(chunks).toString();

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
