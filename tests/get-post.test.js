
const assert = require('assert')

const fetchPost = require('../src/instagram/post/fetch-json')
const createPostDataModel = require('../src/instagram/post/create-data-model')
const validatePostJson = require('../src/instagram/post/validate-json')

describe('Test getPost', function() {
    this.timeout(10000)
    let json = null

    before(async function () {
        json = await fetchPost(process.argv[4] || 'Bqx7o8dhETN')
    })

    it('validate json', async function() {
        const res = validatePostJson(json)

        if (res.errors.length) {
            throw new Error(res.errors[0])
        }
    })

    it('should validate json and create data model', async function() {
        const res = validatePostJson(json)

        if (res.errors.length) {
            throw new Error(res.errors[0])
        }

        const data = createPostDataModel(json)
        assert.equal(data.code, process.argv[4] || 'Bqx7o8dhETN')
    })
})