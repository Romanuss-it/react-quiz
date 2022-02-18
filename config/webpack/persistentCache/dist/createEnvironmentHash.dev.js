'use strict';

var _require = require('crypto'),
    createHash = _require.createHash;

module.exports = function (env) {
  var hash = createHash('md5');
  hash.update(JSON.stringify(env));
  return hash.digest('hex');
};