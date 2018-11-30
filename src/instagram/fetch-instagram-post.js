
const request = require('superagent')

const getErrorOrigin = require('../error/get-origin')

class FetchInstagramPostError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'FetchInstagramPostError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

const fetchInstagramPost = async (postCode) => {
    try {
        const url = `https://www.instagram.com/p/${postCode}?__a=1`
        const res = await request.get(url)
        return res.body
    } catch (err) {
        if (err.status === 404) {
            throw new FetchInstagramPostError('Instagram post not found')
        }

        throw new FetchInstagramPostError(err.message)
    }
}

module.exports = fetchInstagramPost
