const sha256 = require('crypto-js/sha256');

class Blockchain {
  constructor({ difficulty = 2}) {
    this.chain = [];
    this.difficulty = difficulty;
  }

  addBlock(block) {
    if(this.validateBlock(block)) {
      this.chain.push(block);
    }
  }

  async mineBlock(block) {
    block.setPreviousHash(this.findPreviousHash());

    const miner = new Miner(block, this.difficulty);
    await miner.generateHash();

    this.addBlock(miner.block);
  }

  validateBlock(block) {
    const previousHash = this.findPreviousHash();
    const blockHash = this.calculateBlockHash(block);

    if (
      (previousHash === block.previousHash) &&
      (blockHash === block.hash)
    ) return true;

    return false
  }

  calculateBlockHash(block) {
    const message = `${JSON.stringify(block.data)}${block.nounce}${block.previousHash}`;
    const hash = sha256(message).toString();

    return hash;
  }

  findPreviousHash() {
    const lastBlock = this.chain[this.chain.length -1];

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

  setPreviousHash(hash) {
    this.previousHash = hash;
  }
}

const chain = new Blockchain({difficulty: 2});

const values = [1];

for (var i = 0; i < values.length; i++) {
  const block = new Block({
    data: { amount: values[i] },
  });
  chain.mineBlock(block);
}

// This gives time to the for to start executing,
// and the await to kick in. It will wait until all are resolved
setTimeout(function () {
  // console.log(JSON.stringify(chain, null, 2));

  const block = new Block({
    data: { amount: 2 },
  });
  chain.mineBlock(block);

  setTimeout(function () {
    console.log(JSON.stringify(chain, null, 2));

  }, 10);

}, 10);
