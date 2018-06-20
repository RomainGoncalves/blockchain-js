class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
    this.hash = '';
  }

  setPreviousHash(hash) {
    this.previousHash = hash;
  }
}

module.exports = Block;
