const sha256 = require('crypto-js/sha256');

class Blockchain {
  constructor({ difficulty = 2}) {
    this.blocks = [];
    this.difficulty = difficulty;
    // this.numberOfZeros = this.generateZeros();
  }

  addBlock(block) {
    if(this.validateBlock(block)) {
      this.blocks.push(block);
    }
  }

  async mineBlock(block) {
    block.previousHash = this.findPreviousHash();
    const miner = new Miner(block, this.difficulty);
    await miner.generateHash();

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
    this.numberOfZeros = this.generateZeros();
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

    const promise = new Promise(resolve => {
      while (hashSub !== this.numberOfZeros) {
        const message = `${JSON.stringify(this.block.data)}${nounce}${this.block.previousHash}`;
        hash = sha256(message).toString();
        hashSub = hash.substring(0, this.difficulty);

        if(hashSub === this.numberOfZeros) {
          this.block.nounce = nounce;
          this.block.hash = hash;
          resolve(this.block);
        }

        // if(nounce === 1000) break;

        nounce++;
      }
    });

    return promise;
  }
}

class Block {
  constructor({data = {}}) {
    this.data = data;
    this.previousHash = '';
    this.hash = '';
  }
}

const chain = new Blockchain({difficulty: 2});

const values = [1, 2];

for (var i = 0; i < values.length; i++) {
  const block = new Block({ data: { amount: values[i] }});
  chain.mineBlock(block);
  // console.log(block);
}

// This gives time to the for to start executing,
// and the await to kick in. It will wait until all are resolved
setTimeout(function () {
  console.log(JSON.stringify(chain, null, 2));
}, 10);
