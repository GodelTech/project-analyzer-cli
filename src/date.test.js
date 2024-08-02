const { getFormattedDate } = require('./date');

describe('Date functions', () => {
  describe('getFormattedDate', () => {
    it('should return string date in a correct format', () => {
      expect(getFormattedDate()).toMatch(/\d{2}-\w{2,4}-\d{4}/);
    });
  });
});
