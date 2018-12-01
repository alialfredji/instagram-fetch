/**
 * Fetch an Instagram account
 * 
 * returns the json found in the html
 */

const cheerio = require('cheerio')
const fetch = require('isomorphic-fetch')

const getErrorOrigin = require('../../error/get-origin')

class FetchInstagramProfileError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'FetchInstagramProfileError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

const extractInstagramDataFromHtml = (html) => {
    let payload

    let dom = cheerio.load(html)
    dom = dom('script').filter(item => item.type === 'script')
    const scriptThree = dom.prevObject['3']
    const scriptFour = dom.prevObject['4']
    dom = scriptThree

    if (!dom.children || !dom.children[0]) {
        throw new Error('Instagram profile not found')
    }

    dom = dom.children[0].data
    payload = dom.indexOf('window._sharedData') !== -1 ? dom : null

    // if above is null, try the second script
    if (payload === null) {
        dom = scriptFour

        if (!dom.children || !dom.children[0]) {
            throw new Error('Instagram profile not found')
        }

        dom = dom.children[0].data
        payload = dom.indexOf('window._sharedData') !== -1 ? dom : null

        if (payload === null) {
            throw new Error('failed to parse profile')
        }
    }

    payload = payload.replace('window._sharedData = ', '')
    payload = payload.substring(0, payload.length - 1)
    payload = JSON.parse(payload).entry_data.ProfilePage[0]

    return payload
}

const fetchInstagramProfile = async (username) => {
    const url = `https://www.instagram.com/${username}`

    try {
        const res = await fetch(url)
        const html = await res.text()
        const profile = extractInstagramDataFromHtml(html)

        if (!profile) {
            throw new Error('Instagram profile not found')
        }

        return profile
    } catch (err) {
        throw new FetchInstagramProfileError(err)
    }
}

module.exports = fetchInstagramProfile

