
const { emailRegex } = require('./string-utils')

const text2emails = (text = '') => {
    if (!text && !text.length) {
        return []
    }

    const emails = text.match(emailRegex)

    if (emails === null) {
        return []
    }

    return emails
}

module.exports = text2emails
