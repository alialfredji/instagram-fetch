
const { getAvgInteger } = require('./array-utils')

const getAvgLikes = (posts) => {
    if (posts.length === 0) {
        return 0
    }

    const likesList = posts.map(item => item.likes)

    return getAvgInteger(likesList)
}

module.exports = getAvgLikes
