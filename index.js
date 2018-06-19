const sha256 = require('crypto-js/sha256');

class Blockchain {
  constructor() {
    this.blocks = [];
    this.difficulty = 1;
  }

  addBlock(block) {
    block.previousHash = this.findPreviousHash();
    if(this.validateBlock(block)) {
      this.blocks.push(block);
    }
  }

  validateBlock(block) {
    return true;
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
    this.difficulty = 4;
    this.numberOfZeros = this.generateZeros();

    this.hash = this.generateHash();
  }

  generateZeros() {
    let numberOfZeros = '';

    for (var i = 0; i < this.difficulty; i++) {
      numberOfZeros = numberOfZeros.concat('0');
    }

    return numberOfZeros;
  }

  generateHash() {
    let hash = '';
    let hashSub = hash.substring(0, this.difficulty);
    let nounce = 0;

    while (hashSub !== this.numberOfZeros) {
      hash = sha256(JSON.stringify(this.data + nounce)).toString();
      hashSub = hash.substring(0, this.difficulty);

      if(hashSub === this.numberOfZeros) {
        this.nounce = nounce;
      }

      nounce++;
    }

    return hash;
  }
}

const chain = new Blockchain();

for (var i = 0; i < [1].length; i++) {
  const block = new Block({ data: { amount: [1][i] }});
  chain.addBlock(block);
}

console.log(JSON.stringify(chain, null, 2));
