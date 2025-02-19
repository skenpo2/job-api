const { formatDistanceToNow } = require('date-fns');

const getTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

module.exports = getTimeAgo;
