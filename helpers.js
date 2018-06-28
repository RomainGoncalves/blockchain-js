const sha256 = require('crypto-js/sha256');

/**
 * Function that transforms passed data into a string
 * and passes it twice through a hash method
 *
 * @param  {Any} data    The data to hash
 * @return {String}      The final hash
 */
exports.doubleHashing = function (data) {
  return sha256(sha256(JSON.stringify(data))).toString();
};
