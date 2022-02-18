'use strict';

var babelJest = require('babel-jest')["default"];

var hasJsxRuntime = function () {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');

    return true;
  } catch (e) {
    return false;
  }
}();

module.exports = babelJest.createTransformer({
  presets: [[require.resolve('babel-preset-react-app'), {
    runtime: hasJsxRuntime ? 'automatic' : 'classic'
  }]],
  babelrc: false,
  configFile: false
});