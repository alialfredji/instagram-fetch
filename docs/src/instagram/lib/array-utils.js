
const getAvgNumber = (numbersList) =>
    numbersList.reduce((tot, value) => tot + value, 0) / numbersList.length

const getAvgInteger = (numbersList) => Math.round(getAvgNumber(numbersList))

module.exports = {
    getAvgInteger,
    getAvgNumber,
}
