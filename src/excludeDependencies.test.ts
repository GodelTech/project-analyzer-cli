import excludeDependencies from './excludeDependencies';

const mockReport = {
  name: 'test',
  dependencies: {
    axios: ['1.0.0', '1.1.0'],
    react: ['18.6.0'],
  },
};

describe('excludeDependencies', () => {
  it('should exclude dependencies when exclude list is not empty', () => {
    expect(excludeDependencies(mockReport, ['axios'])).toEqual({
      name: 'test',
      dependencies: {
        react: ['18.6.0'],
      },
    });
  });

  it('should not exclude dependencies when the exclude list is empty', () => {
    expect(excludeDependencies(mockReport)).toEqual(mockReport);
  });
});
