
const fetchPostJson = require('./instagram/post/fetch-json')
const createPostDataModel = require('./instagram/post/create-data-model')
const validatePostJson = require('./instagram/post/validate-json')

const fetchProfile = require('./instagram/profile/fetch-json')
const createProfileDataModel = require('./instagram/profile/create-data-model')

const getPost = async (code) => {
    try {
        const json = await fetchPostJson(code)
        const validation = validatePostJson(json)

        if (validation.errors.length) {
            throw new Error(res.errors[0])
        }

        const data = createPostDataModel(json)

        return data
    } catch (err) {
        throw err
    }
}

const getProfile = async (username) => {
    try {
        const json = await fetchProfile(username)
        const data = createProfileDataModel(json)

        return data
    } catch (err) {
        throw err
    }
}

module.exports = {
    getPost,
    getProfile,
}