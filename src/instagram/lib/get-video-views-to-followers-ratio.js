
const getVideoViewsToFollowersRatio = (videoViews, followers) => {
    if (videoViews === null) {
        return null
    }

    const ratio = videoViews / followers

    return ratio.toFixed(4) / 1
}

module.exports = getVideoViewsToFollowersRatio
