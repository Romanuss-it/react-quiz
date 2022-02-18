'use strict';

var path = require('path'); // This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html


module.exports = {
  process: function process(src, filename) {
    return "module.exports = ".concat(JSON.stringify(path.basename(filename)), ";");
  }
};