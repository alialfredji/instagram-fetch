
const { hashtagsRegex } = require('./string-utils')

const getHashtags = (text) => {
    if (!text && !text.length) {
        return []
    }

    let hashtags = text.match(hashtagsRegex)

    if (hashtags === null) {
        return []
    }

    // remove '#' from string
    let tags = hashtags.map(item => item.replace(/#/gi, ''))
    tags = tags.map(item => item.toLowerCase())

    // filter duplicates
    const hashtagsWithoutDuplicates = []
    tags.map(item => (
        hashtagsWithoutDuplicates.indexOf(item) === -1
            ? hashtagsWithoutDuplicates.push(item)
            : null
    ))
    hashtags = hashtagsWithoutDuplicates

    // filter out hashtags longer than 50 characters
    hashtags = hashtags.filter(item => item.length < 50)

    return hashtags
}

module.exports = getHashtags
