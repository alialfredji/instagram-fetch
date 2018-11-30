
const getEstPostPrice = (followers, likes, engagementRate) => {
    let estimatedPostPrice = (followers * (5 / 1000)) + ((likes * 0.43) * engagementRate)

    estimatedPostPrice = Math.round(estimatedPostPrice)

    return estimatedPostPrice !== null
        ? estimatedPostPrice
        : 0
}

module.exports = getEstPostPrice
