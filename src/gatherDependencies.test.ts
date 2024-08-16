import gatherDepandencies from './gatherDepandencies';

describe('gatherDependencies', () => {
  let globalConsoleLog: (...args: string[]) => void;

  beforeAll(() => {
    globalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = globalConsoleLog;
  });

  it('should return dependencies from read file', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package.json`,
    ]);

    expect(result).toEqual({
      name: 'test',
      dependencies: {
        react: ['18.6.0'],
        jest: ['29.7.0'],
        'jest-cli': ['29.7.0'],
      },
    });
  });

  it('should return dependencies from read file with only dependencies', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package-dependencies.json`,
    ]);

    expect(result).toEqual({
      name: 'test',
      dependencies: {
        react: ['18.6.0'],
      },
    });
  });

  it('should return dependencies from read file with only devDependencies', () => {
    const result = gatherDepandencies('test', [
      `${__dirname}/../mocks/package-dev-dependencies.json`,
    ]);

    expect(result).toEqual({
      name: 'test',
      dependencies: {
        jest: ['29.7.0'],
        'jest-cli': ['29.7.0'],
      },
    });
  });
});
