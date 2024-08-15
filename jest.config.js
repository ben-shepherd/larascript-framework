module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@app/(.*)$': '<rootDir>/src/app/$1'
    },
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    testSequencer: '<rootDir>/src/tests/customSequencer.ts'
  };