
const getAvgNumber = (numbersList) => {
    const sum = numbersList.reduce((tot, value) => tot + value, 0)

    return sum / numbersList.length
}

const getAvgInteger = (numbersList) => {
    const avg = getAvgNumber(numbersList)

    return Math.round(avg)
}

module.exports = {
    getAvgInteger,
    getAvgNumber,
}
