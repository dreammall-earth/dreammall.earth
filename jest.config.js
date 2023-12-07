/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line import/no-commonjs
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!src/index.ts', '!build/**'],
  coverageThreshold: {
    global: {
      lines: 100,
    },
  },
  setupFiles: ['./test/testSetup.ts'],
  setupFilesAfterEnv: ['./test/testSetupAfterEnv.ts'],
}
