const sha256 = require('crypto-js/sha256');
const omit = require('lodash/omit');

const Block = require('./Block');

const helpers = require('./helpers');

describe('Block', () => {
  let block;

  beforeEach(() => {
    block = new Block({
      chainTransactions: [
        { amount: 10 },
        { amount: 20 },
      ]
    });
  });

  it('should exist', () => {
    expect(typeof Block).toBe('function');
  });

  describe('Init', () => {
    it('should set the transactions for this block', () => {
      expect(block.transactions).toEqual([
        { amount: 10 },
        { amount: 20 },
      ]);
    });

    it('should initialises the header', () => {
      expect(omit(block.header, 'miningCompetition.timestamp')).toEqual({
        "merkleRoot": "00dc024c6302e7207c52f0b840a390de542c7cdf81db93ce9339c2d7bf2b5ade",
        "miningCompetition": {
          "difficulty": 2,
          "nounce": 0,
        },
        "previousHash": 0,
      });
    });
  });

  describe('Merkle Root', () => {
    it('should create a Merkle root as expected', () => {
      const a1 = helpers.doubleHashing({ amount: 10 });
      const a2 = helpers.doubleHashing({ amount: 20 });
      const merkleRoot = helpers.doubleHashing(a1 + a2);

      expect(block.createMerkleRoot([
        { amount: 10 },
        { amount: 20 },
      ])).toEqual(merkleRoot);
    });
  });

  describe('Transactions', () => {
    it('should set the transaction according to the limit', () => {
      expect(block.transactions.length).toEqual(2);

      const block2 = new Block({
        chainTransactions: [
          { amount: 10 },
          { amount: 20 },
          { amount: 30 },
        ]
      });

      expect(block2.transactions.length).toEqual(2);

      const block3 = new Block({
        transactionLimit: 3,
        chainTransactions: [
          { amount: 10 },
          { amount: 20 },
          { amount: 30 },
          { amount: 40 },
          { amount: 50 },
          { amount: 60 },
        ]
      });

      expect(block3.transactions.length).toEqual(3);

      const block4 = new Block({
        transactionLimit: 3,
        chainTransactions: [
          { amount: 10 },
        ]
      });

      expect(block4.transactions.length).toEqual(1);
    });

    it('should return an error if there are no transaction in the chain', () => {
      expect(() => new Block({})).toThrowError('There are no transactions in the chain');
    });
  });

  describe('Set previous hash', () => {
    it('should set the previous hash', () => {
      block.setPreviousHash('1234');

      expect(block.header.previousHash).toEqual('1234');
    });
  });
});
