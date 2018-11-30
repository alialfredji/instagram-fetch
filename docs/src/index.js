
const fetchPost = require('./instagram/fetch-instagram-post')
const createPostDataModel = require('./instagram/post-data-model')

const fetchProfile = require('./instagram/fetch-instagram-profile')
const createProfileDataModel = require('./instagram/profile-data-model')

const getPost = async (code) => {
    try {
        const json = await fetchPost(code)
        const data = await createPostDataModel(json)

        return data
    } catch (err) {
        throw err
    }
}

const getProfile = async (username) => {
    try {
        const json = await fetchProfile(username)
        const data = await createProfileDataModel(json)

        return data
    } catch (err) {
        throw err
    }
}

module.exports = {
    getPost,
    getProfile,
}