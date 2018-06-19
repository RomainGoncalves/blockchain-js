const sha256 = require('crypto-js/sha256');

class Blockchain {
  constructor() {
    this.blocks = [];
  }

  addBlock(block) {
    block.previousHash = this.findPreviousHash();
    this.blocks.push(block);
  }

  findPreviousHash() {
    const lastBlock = this.blocks[this.blocks.length -1];

    if(lastBlock !== undefined) return lastBlock.hash;

    return 0;
  }
}

class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
    this.hash = this.generateHash();
  }

  generateHash() {
    return sha256(JSON.stringify(this.data)).toString();
  }
}

const chain = new Blockchain();

for (var i = 0; i < [1,2,3,4].length; i++) {
  const block = new Block({ data: { amount: [1,2,3,4][i] }});
  chain.addBlock(block);
}

console.log(JSON.stringify(chain, null, 2));
