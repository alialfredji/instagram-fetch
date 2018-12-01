
const getUploadFrequencyPerWeek = (posts) => {
    if (posts.length === 0) {
        return {
            month: 0,
            week: 0,
        }
    }

    // count date diff from last uploaded post
    const lastPostTimestamp = posts[posts.length - 1].timestamp
    const dateDiff = new Date() - lastPostTimestamp

    const dateDiffAvg = dateDiff/posts.length
    const weekTimestamp = 1000 * 60 * 60 * 24 * 7
    const monthTimestamp = weekTimestamp * 30 

    return {
        month: Math.round(monthTimestamp / dateDiffAvg),
        week: Math.round(weekTimestamp / dateDiffAvg)
    }
}

module.exports = getUploadFrequencyPerWeek
