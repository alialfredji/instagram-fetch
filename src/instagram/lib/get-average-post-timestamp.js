
const { getAvgInteger } = require('./array-utils')

const getAvgPostTimestamp = (posts) =>
    getAvgInteger(posts.map(post => post.timestamp))

module.exports = getAvgPostTimestamp
