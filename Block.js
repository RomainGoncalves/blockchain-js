class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
    this.hash = '';
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
      merkleRoot: ''
    }
  }

  setPreviousHash(hash) {
    this.header.previousHash = hash;
  }
}

module.exports = Block;
