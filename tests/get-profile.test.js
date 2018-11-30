
const assert = require('assert')

const { getProfile } = require('../src')

describe('Test getProfile', function() {
    this.timeout(10000)

    it('should fetch instagram profile', async function() {
        await getProfile(process.argv[4] || 'instagram')
    })

    it('should fetch instagram profile and validate username prop', async function() {
        const data = await getProfile(process.argv[4] || 'instagram')
        assert.equal(data.username, process.argv[4] || 'instagram')
    })
})