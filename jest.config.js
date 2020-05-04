module.exports = {
  moduleFileExtensions: ['js','ts'],
  verbose: true,
  testMatch: [
    '**/test/**/*.test.ts'
  ],
  transform: {
    "\\.(ts)$": "ts-jest"
  },
  testEnvironment: 'node'
}
