
const fetchProfile = require('./fetch-json')
const createProfileDataModel = require('./create-data-model')

module.exports = async (username) => {
    try {
        const json = await fetchProfile(username)
        const data = createProfileDataModel(json)

        return data
    } catch (err) {
        throw err
    }
}