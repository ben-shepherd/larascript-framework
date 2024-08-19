module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    testSequencer: '<rootDir>/src/tests/customSequencer.ts'
  };