
const { getAvgInteger } = require('./array-utils')

const getAvgComments = (posts) =>
    posts.length === 0
        ? 0
        : getAvgInteger(posts.map(item => item.comments))

module.exports = getAvgComments
