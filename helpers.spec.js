const sha256 = require('crypto-js/sha256');

const helpers = require('./helpers');

describe('Helpers', () => {
  describe('Double Hashing', () => {
    it('should return any data, hashed twiced', () => {
      const a = 'string';
      const h1 = sha256(sha256(JSON.stringify(a))).toString();

      expect(helpers.doubleHashing(a)).toEqual(h1);

      const b = ['string', 'hello'];
      const h2 = sha256(sha256(JSON.stringify(b))).toString();

      expect(helpers.doubleHashing(b)).toEqual(h2);

      const c = { param: 'object', value: true };
      const h3 = sha256(sha256(JSON.stringify(c))).toString();

      expect(helpers.doubleHashing(c)).toEqual(h3);
    });
  });
});
