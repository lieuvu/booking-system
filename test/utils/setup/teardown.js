/**
 * The file is used to run once after ALL test suits in jest.
 * It is configured in the file jest.config.js with the property
 * 'globalTeardown'
 */

const DBUtil = require("../db-util").DBUtil;

module.exports = async () => {
  await DBUtil.teardown();
};
