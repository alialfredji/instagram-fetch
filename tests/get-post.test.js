
const assert = require('assert')

const fetchPost = require('../src/instagram/fetch-instagram-post')
const createPostDataModel = require('../src/instagram/post-data-model')

describe('Test getPost', function() {
    this.timeout(10000)

    it('should fetch instagram post', async function() {
        await fetchPost(process.argv[4] || 'Bqx7o8dhETN')
    })

    it('should fetch instagram post and validate code prop', async function() {
        const json = await fetchPost(process.argv[4] || 'Bqx7o8dhETN')
        const data = createPostDataModel(json)
        assert.equal(data.code, process.argv[4] || 'Bqx7o8dhETN')
    })
})