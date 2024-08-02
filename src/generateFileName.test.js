const generateFileName = require('./generateFileName');

describe('generateFileName', () => {
  it('should return filename in correct format', () => {
    expect(generateFileName('Test Project Name')).toMatch(
      /test-project-name-\d{2}-\w{2,4}-\d{4}\.json/,
    );
  });

  it('should return filename in correct format even without a project name provided', () => {
    expect(generateFileName()).toMatch(/report-\d{2}-\w{2,4}-\d{4}\.json/);
  });
});
