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
    '^@src\/(.*)$': '<rootDir>/src/$1',
    '^@models\/(.*)$': '<rootDir>/src/models/$1',
    '^@util\/(.*)$': '<rootDir>/src/util/$1'

  },
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/global_test/global-setup.js',
  globalTeardown: '<rootDir>/test/global_test/global-teardown.js'
}
