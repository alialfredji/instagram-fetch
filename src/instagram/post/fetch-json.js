
const request = require('superagent')

const getErrorOrigin = require('../../error/get-origin')

class FetchPostError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'FetchPostError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

const fetchPost = async (postCode) => {
    try {
        const url = `https://www.instagram.com/p/${postCode}?__a=1`
        const res = await request.get(url)
        return res.body
    } catch (err) {
        throw new FetchPostError(err.message)
    }
}

module.exports = fetchPost
