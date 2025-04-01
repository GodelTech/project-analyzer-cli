import gatherDepandencies from './gatherDependencies';

describe('gatherDependencies', () => {
  let globalConsoleLog: (...args: string[]) => void;

  beforeAll(() => {
    globalConsoleLog = console.log;
    console.log = jest.fn();
    jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('1/1/25');
  });

  afterAll(() => {
    console.log = globalConsoleLog;
    jest.restoreAllMocks();
  });

  it('should return dependencies from read file', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package.json`,
    ]);

    const expected: AnalyserReport = {
      projectName: 'test',
      reportDate: '1/1/25',
      dependencies: [
        {
          name: 'react',
          versions: ['18.6.0'],
          minVersion: '18.6.0',
          maxVersion: '18.6.0',
        },
        {
          name: 'jest',
          versions: ['29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
        {
          name: 'jest-cli',
          versions: ['29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it('should return additional dependencies from another file', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package.json`,
      `${__dirname}/../mocks/package-additional.json`,
    ]);

    const expected: AnalyserReport = {
      projectName: 'test',
      reportDate: '1/1/25',
      dependencies: [
        {
          name: 'react',
          versions: ['18.6.0', '^19.0.0'],
          minVersion: '18.6.0',
          maxVersion: '19.0.0',
        },
        {
          name: 'jest',
          versions: ['29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
        {
          name: 'jest-cli',
          versions: ['29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it('should return dependencies from read file with only dependencies', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package-dependencies.json`,
    ]);

    expect(result).toEqual({
      projectName: 'test',
      reportDate: '1/1/25',
      dependencies: [
        {
          name: 'react',
          versions: ['18.6.0'],
          minVersion: '18.6.0',
          maxVersion: '18.6.0',
        },
      ],
    });
  });

  it('should return dependencies from read file with only devDependencies', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package-dev-dependencies.json`,
    ]);

    expect(result).toEqual({
      projectName: 'test',
      reportDate: '1/1/25',
      dependencies: [
        {
          name: 'jest',
          versions: ['^29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
        {
          name: 'jest-cli',
          versions: ['29.7.0'],
          minVersion: '29.7.0',
          maxVersion: '29.7.0',
        },
      ],
    });
  });
});
