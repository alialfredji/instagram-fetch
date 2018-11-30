
const { getAvgInteger } = require('./array-utils')

const getAvgPostTimestamp = (posts) => {
    const timestamps = posts.map(post => post.timestamp)

    return getAvgInteger(timestamps)
}

module.exports = getAvgPostTimestamp
