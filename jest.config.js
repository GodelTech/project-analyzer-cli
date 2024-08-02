module.exports = {
  coveragePathIgnorePatterns: ['/node_modules', '/coverage', 'index.js'],
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage/',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
