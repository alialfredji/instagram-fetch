
const { getAvgInteger } = require('./array-utils')

const getAvgVideoViews = (posts) => {
    if (posts.length === 0) {
        return null
    }

    let videoViewsList = posts.map(item => item.videoViews)
    videoViewsList = videoViewsList.filter(item => item !== undefined)

    if (videoViewsList.length === 0) {
        return null
    }

    return getAvgInteger(videoViewsList)
}

module.exports = getAvgVideoViews
