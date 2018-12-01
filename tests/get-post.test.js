
const assert = require('assert')

const fetchPost = require('../src/instagram/post/fetch-json')
const createPostDataModel = require('../src/instagram/post/create-data-model')
const validatePostJson = require('../src/instagram/post/validate-json')
const getPost = require('../src/instagram/post')

describe('Test getPost', function() {
    this.timeout(10000)
    let json = null

    before(async function () {
        json = await fetchPost(process.argv[3] || 'Bqx7o8dhETN')
    })

    it('should validate json', async function() {
        const validation = validatePostJson(json)
        if (validation.errors.length) throw new Error(validation.errors[0])
    })

    it('should validate json and create data model', async function() {
        const validation = validatePostJson(json)
        if (validation.errors.length) throw new Error(validation.errors[0])

        const data = createPostDataModel(json)
        assert.equal(data.code, process.argv[3] || 'Bqx7o8dhETN')
    })

    it('should test model getPost', async function() {
        const data = await getPost(process.argv[3] || 'Bqx7o8dhETN')
        assert.equal(data.code, process.argv[3] || 'Bqx7o8dhETN')
    })
})