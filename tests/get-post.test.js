
const assert = require('assert')

const { getPost } = require('../src')

describe('Test getPost', function() {
    this.timeout(10000)

    it('should fetch instagram post', async function() {
        await getPost(process.argv[4] || 'Bqx7o8dhETN')
    })

    it('should fetch instagram post and validate code prop', async function() {
        const data = await getPost(process.argv[4] || 'Bqx7o8dhETN')
        assert.equal(data.code, process.argv[4] || 'Bqx7o8dhETN')
    })
})