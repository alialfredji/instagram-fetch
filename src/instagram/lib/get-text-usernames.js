
const { mentionsRegex } = require('./string-utils')

const getTextUsernames = (text) => {
    if (!text && !text.length) {
        return []
    }

    const usernamesMention = text.match(mentionsRegex)

    if (usernamesMention === null) {
        return []
    }

    let usernames = usernamesMention.map(item => item.replace(/@/gi, ''))
    usernames = usernames.map(item => item.toLowerCase())

    const usernamesWithoutDuplicates = []

    usernames.map(item => (
        usernamesWithoutDuplicates.indexOf(item) === -1
            ? usernamesWithoutDuplicates.push(item)
            : null
    ))

    return usernamesWithoutDuplicates
}

module.exports = getTextUsernames
