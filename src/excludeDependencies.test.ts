import excludeDependencies from './excludeDependencies';

const mockReport: AnalyserReport = {
  projectName: 'test',
  reportDate: '1/20/2025',
  dependencies: [
    {
      name: 'axios',
      versions: ['1.0.0', '1.1.0'],
    },
    {
      name: 'react',
      versions: ['18.6.0'],
    },
  ],
};

describe('excludeDependencies', () => {
  it('should exclude dependencies when exclude list is not empty', () => {
    expect(excludeDependencies(mockReport, ['axios'])).toEqual({
      projectName: 'test',
      reportDate: '1/20/2025',
      dependencies: [
        {
          name: 'react',
          versions: ['18.6.0'],
        },
      ],
    });
  });

  it('should not exclude dependencies when the exclude list is empty', () => {
    expect(excludeDependencies(mockReport)).toEqual(mockReport);
  });
});
