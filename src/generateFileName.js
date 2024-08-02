const { getFormattedDate } = require('./date');

module.exports = (projectName) => {
  const date = getFormattedDate();

  const projectNameToFileName =
    projectName?.split(' ').join('-').toLowerCase() || 'report';

  return `${projectNameToFileName}-${date}.json`;
};
