
const getVideoViewsToFollowersRatio = (videoViews, followers) =>
    videoViews === null
        ? null
        : (videoViews / followers).toFixed(4) / 1

module.exports = getVideoViewsToFollowersRatio
