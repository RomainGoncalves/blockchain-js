const sha256 = require('crypto-js/sha256');
const Blockchain = require('./Blockchain');
const Transaction = require('./Transaction');
const chain = new Blockchain({difficulty: 3, transactionLimit: 3});

setTimeout(function () {
  console.log('--------');

  [10, 20, 30, 40, 50, 60, 70, 80,  90].forEach(t => chain.createTransaction(new Transaction({amount: t})));

  chain.createBlock();
  chain.createBlock();
  // chain.createBlock();

  // chain.candidateBlocks.forEach(
    // block =>
    chain.mineBlock();
  // );

  // This gives time to the for to start executing,
  // and the await to kick in. It will wait until all are resolved

  // chain.createBlock();
  chain.mineBlock();

  // console.log(JSON.stringify(chain, null, 2));
  //
  // const block = new Block({
  //   data: { amount: 2 },
  // });
  // chain.mineBlock(block);

  // setTimeout(function () {
    console.log(JSON.stringify(chain, null, 2));
  // }, 10);
}, 500);
