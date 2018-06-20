const sha256 = require('crypto-js/sha256');

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
        const message = JSON.stringify(this.block.header);
        hash = sha256(message).toString();
        hashSub = hash.substring(0, this.difficulty);

        if(hashSub === this.numberOfZeros) {
          this.block.hash = hash;
          resolve(this.block);
          break;
        }

        // if(this.block.header.miningCompetition.nounce === 1000) {
        //   resolve();
        //   break;
        // }

        this.block.header.miningCompetition.nounce++;
      }
    });

    return promise;
  }
}

module.exports = Miner;
