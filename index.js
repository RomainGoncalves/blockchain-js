const sha256 = require('crypto-js/sha256');

class Blockchain {
  constructor({ difficulty = 2}) {
    this.blocks = [];
    this.difficulty = difficulty;
    // this.numberOfZeros = this.generateZeros();
  }

  addBlock(block) {
    block.previousHash = this.findPreviousHash();
    if(this.validateBlock(block)) {
      this.blocks.push(block);
    }
  }

  mineBlock(block) {
    const miner = new Miner(block);
    miner.generateHash();
    // block.hash = this.generateHash(block);

    this.addBlock(miner.block);
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

class Miner {
  constructor(block, difficulty) {
    this.block = block;
    this.difficulty = difficulty;
    this.numberOfZeros = '';
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
      const message = `${JSON.stringify(this.block.data)}${nounce}`;
      hash = sha256(message).toString();
      hashSub = hash.substring(0, this.difficulty);

      if(hashSub === this.numberOfZeros) {
        this.block.nounce = nounce;
        this.block.hash = hash;
      }

      // if(nounce === 1000) break;

      nounce++;
    }
  }
}

class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
  }
}

const chain = new Blockchain({ difficulty: 3});

for (var i = 0; i < [1,2,3,4,5].length; i++) {
  const block = new Block({ data: { amount: [1,2,3,4,5][i] }});
  chain.mineBlock(block);
}

console.log(JSON.stringify(chain, null, 2));
