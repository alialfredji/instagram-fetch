
const assert = require('assert')

const fetchProfile = require('../src/instagram/profile/fetch-json')
const createProfileDataModel = require('../src/instagram/profile/create-data-model')
const validateProfileJson = require('../src/instagram/profile/validate-json')
const validateProfileMediaJson = require('../src/instagram/profile/validate-media-json')
const getProfile = require('../src/instagram/profile')

describe('Test getProfile', function() {
    this.timeout(10000)
    let json = null

    before(async function() {
        json = await fetchProfile(process.argv[3] || 'instagram')
    })

    it('should validate json', function() {
        const res = validateProfileJson(json)
        if (res.errors.length) throw new Error(res.errors[0])

        const media = json.graphql.user.edge_owner_to_timeline_media.edges

        if (media.length) {
            const res2 = validateProfileMediaJson(media[0])
            if (res2.errors.length) throw new Error(res2.errors[0])
        }
    })

    it('should validate json and create data model', async function() {
        const res = validateProfileJson(json)
        if (res.errors.length) throw new Error(res.errors[0])

        const media = json.graphql.user.edge_owner_to_timeline_media.edges

        if (media.length) {
            const res2 = validateProfileMediaJson(media[0])
            if (res2.errors.length) throw new Error(res2.errors[0])
        }

        const data = createProfileDataModel(json)
        assert.equal(data.username, process.argv[3] || 'instagram')
    })

    it.only('should test model getPofile', async function() {
        const data = await getProfile(process.argv[3] || 'instagram')
        console.log(data)
        assert.equal(data.username, process.argv[3] || 'instagram')
    })
})