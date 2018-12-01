
const fetchPostJson = require('./fetch-json')
const createPostDataModel = require('./create-data-model')
const validatePostJson = require('./validate-json')

const validateJson = (json) => {
    const validation = validatePostJson(json)

    if (validation.errors.length) {
        throw new Error(res.errors[0])
    }
}

module.exports = async (code) => {
    try {
        const json = await fetchPostJson(code)
        validateJson(json)
        return createPostDataModel(json)
    } catch (err) {
        throw err
    }
}

