/**
 * The file is used to run once before ALL test suits in jest.
 * It is configured in the file jest.config.js with the property
 * 'globalSetup'
 */

 // Library
require('module-alias/register')
const DBUtil = require('../db-util').DBUtil;

module.exports = async () => {
  await DBUtil.setup();
}
