/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  // ignore files from test/helpers
  testPathIgnorePatterns: ['<rootDir>/test/helpers/'],
  coveragePathIgnorePatterns: ['<rootDir>/test/helpers/'],
};
