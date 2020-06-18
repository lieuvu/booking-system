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
    '^@common\/(.*)$': '<rootDir>/src/common/$1',
    '^@controllers\/(.*)$': '<rootDir>/src/controllers/$1',
    '^@interfaces\/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@models\/(.*)$': '<rootDir>/src/models/$1',
    '^@routes\/(.*)$': '<rootDir>/src/routes/$1',
    '^@schemas\/(.*)$': '<rootDir>/src/schemas/$1',
    '^@test\/(.*)$': '<rootDir>/test/$1',
  },
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/utils/setup/setup.js',
  globalTeardown: '<rootDir>/test/utils/setup/teardown.js'
}
