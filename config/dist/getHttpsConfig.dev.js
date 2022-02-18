'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');

var path = require('path');

var crypto = require('crypto');

var chalk = require('react-dev-utils/chalk');

var paths = require('./paths'); // Ensure the certificate and key provided are valid and if not
// throw an easy to debug error


function validateKeyAndCerts(_ref) {
  var cert = _ref.cert,
      key = _ref.key,
      keyFile = _ref.keyFile,
      crtFile = _ref.crtFile;
  var encrypted;

  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error("The certificate \"".concat(chalk.yellow(crtFile), "\" is invalid.\n").concat(err.message));
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error("The certificate key \"".concat(chalk.yellow(keyFile), "\" is invalid.\n").concat(err.message));
  }
} // Read file and throw an error if it doesn't exist


function readEnvFile(file, type) {
  if (!fs.existsSync(file)) {
    throw new Error("You specified ".concat(chalk.cyan(type), " in your env, but the file \"").concat(chalk.yellow(file), "\" can't be found."));
  }

  return fs.readFileSync(file);
} // Get the https config
// Return cert files if provided in env, otherwise just true or false


function getHttpsConfig() {
  var _process$env = process.env,
      SSL_CRT_FILE = _process$env.SSL_CRT_FILE,
      SSL_KEY_FILE = _process$env.SSL_KEY_FILE,
      HTTPS = _process$env.HTTPS;
  var isHttps = HTTPS === 'true';

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    var crtFile = path.resolve(paths.appPath, SSL_CRT_FILE);
    var keyFile = path.resolve(paths.appPath, SSL_KEY_FILE);
    var config = {
      cert: readEnvFile(crtFile, 'SSL_CRT_FILE'),
      key: readEnvFile(keyFile, 'SSL_KEY_FILE')
    };
    validateKeyAndCerts(_objectSpread({}, config, {
      keyFile: keyFile,
      crtFile: crtFile
    }));
    return config;
  }

  return isHttps;
}

module.exports = getHttpsConfig;