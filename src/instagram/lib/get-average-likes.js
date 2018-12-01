
const { getAvgInteger } = require('./array-utils')

const getAvgLikes = (posts) =>
    posts.length === 0
        ? 0
        : getAvgInteger(posts.map(item => item.likes))

module.exports = getAvgLikes
