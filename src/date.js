const getFormattedDate = () =>
  new Date()
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      year: 'numeric',
      month: 'short',
    })
    .split(' ')
    .join('-');

module.exports = { getFormattedDate };
