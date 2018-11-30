
const { getAvgInteger } = require('./array-utils')

const getAvgComments = (posts) => {
    if (posts.length === 0) {
        return 0
    }

    const commentsList = posts.map(item => item.comments)

    return getAvgInteger(commentsList)
}

module.exports = getAvgComments
