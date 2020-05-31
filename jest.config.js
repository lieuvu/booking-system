module.exports = {
  moduleFileExtensions: ['js','ts'],
  verbose: true,
  testMatch: [
    '**/test/**/*.test.ts'
  ],
  transform: {
    '\\.(ts)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@src\/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/global_test/global-setup.js',
  globalTeardown: '<rootDir>/test/global_test/global-teardown.js'
}
