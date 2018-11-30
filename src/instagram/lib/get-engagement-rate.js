
const getEngagementRate = (likes, comments, followers) => {
    let engagementRate = (likes + comments) / followers

    engagementRate = engagementRate.toFixed(4) / 1
    return engagementRate !== null
        ? engagementRate
        : 0
}

module.exports = getEngagementRate
