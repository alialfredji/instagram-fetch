
const { emailRegex } = require('./string-utils')

const text2emails = (text = '') => {
    if (!text && !text.length) {
        return []
    }

    return text.match(emailRegex) === null
        ? []
        : text.match(emailRegex)
}

module.exports = text2emails
