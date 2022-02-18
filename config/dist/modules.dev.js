'use strict';

var fs = require('fs');

var path = require('path');

var paths = require('./paths');

var chalk = require('react-dev-utils/chalk');

var resolve = require('resolve');
/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */


function getAdditionalModulePaths() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var baseUrl = options.baseUrl;

  if (!baseUrl) {
    return '';
  }

  var baseUrlResolved = path.resolve(paths.appPath, baseUrl); // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.

  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  } // Allow the user set the `baseUrl` to `appSrc`.


  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  } // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with
  // an alias.


  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null;
  } // Otherwise, throw an error.


  throw new Error(chalk.red.bold("Your project's `baseUrl` can only be set to `src` or `node_modules`." + ' Create React App does not support other values at this time.'));
}
/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */


function getWebpackAliases() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  var baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc
    };
  }
}
/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */


function getJestAliases() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  var baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      '^src/(.*)$': '<rootDir>/src/$1'
    };
  }
}

function getModules() {
  // Check if TypeScript is setup
  var hasTsConfig = fs.existsSync(paths.appTsConfig);
  var hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error('You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.');
  }

  var config; // If there's a tsconfig.json we assume it's a
  // TypeScript project and set up the config
  // based on tsconfig.json

  if (hasTsConfig) {
    var ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules
    }));

    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config; // Otherwise we'll check if there is jsconfig.json
    // for non TS projects.
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  var options = config.compilerOptions || {};
  var additionalModulePaths = getAdditionalModulePaths(options);
  return {
    additionalModulePaths: additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
    jestAliases: getJestAliases(options),
    hasTsConfig: hasTsConfig
  };
}

module.exports = getModules();