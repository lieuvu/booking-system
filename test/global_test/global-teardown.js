/**
 * The file is used to run once after ALL test suits in jest.
 * It is configured in the file jest.config.js with the property
 * 'globalTeardown'
 */

const globalTest = require("./global-test");

module.exports = async () => {
  await globalTest.teardown();
};
