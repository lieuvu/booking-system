/**
 * The file is used to run once before ALL test suits in jest.
 * It is configured in the file jest.config.js with the property
 * 'globalSetup'
 */

 // Library
require('module-alias/register')
const globalTest = require('./global-test');

module.exports = async () => {
  await globalTest.setup();
}
