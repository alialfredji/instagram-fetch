
const getUploadFrequencyPerWeek = (posts) => {
    let freq = null

    if (posts.length === 0) {
        return 0
    }

    // count date diff from last uploaded post
    const lastPostTimestamp = posts[posts.length - 1].timestamp
    const dateDiff = new Date() - lastPostTimestamp

    const dateDiffAvg = dateDiff/posts.length
    const weekTimestamp = 604800000

    freq = Math.round(weekTimestamp / dateDiffAvg)

    return freq
}

module.exports = getUploadFrequencyPerWeek
