
const assert = require('assert')

const fetchProfile = require('../src/instagram/profile/fetch-json')
const createProfileDataModel = require('../src/instagram/profile/create-data-model')

describe('Test getProfile', function() {
    this.timeout(10000)

    it('should fetch instagram profile', async function() {
        await fetchProfile(process.argv[4] || 'instagram')
    })

    it('should fetch instagram profile and create data model', async function() {
        const json = await fetchProfile(process.argv[4] || 'instagram')
        const data = createProfileDataModel(json)
        assert.equal(data.username, process.argv[4] || 'instagram')
    })
})