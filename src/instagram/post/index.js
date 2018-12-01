
const fetchPostJson = require('./fetch-json')
const createPostDataModel = require('./create-data-model')
const validatePostJson = require('./validate-json')

module.exports = async (code) => {
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

