module.exports = {
  coveragePathIgnorePatterns: ['/node_modules', '/coverage', 'index.ts', 'lib'],
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['text', 'lcov', 'cobertura'],
  coverageDirectory: 'coverage/',
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
};
