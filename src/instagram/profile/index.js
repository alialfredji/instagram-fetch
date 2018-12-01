
const fetchProfile = require('./fetch-json')
const createProfileDataModel = require('./create-data-model')
const validateProfileJson = require('./validate-json')
const validateProfileMediaJson = require('./validate-media-json')

const validateJson = (json) => {
    const res = validateProfileJson(json)
    if (res.errors.length) throw new Error(res.errors[0])

    const media = json.graphql.user.edge_owner_to_timeline_media.edges
    if (media.length) {
        const res2 = validateProfileMediaJson(media[0])
        if (res2.errors.length) throw new Error(res2.errors[0])
    }
}

module.exports = async (username) => {
    try {
        const json = await fetchProfile(username)
        validateJson(json)
        return createProfileDataModel(json)
    } catch (err) {
        throw err
    }
}