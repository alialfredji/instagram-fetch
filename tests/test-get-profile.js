
const { getProfile } = require('../src')

const testGetProfile = async () => {
    try {
        const data = await getProfile(process.argv[2] || 'instagram')
        console.log(data)
    } catch (err) {
        throw err
    }
}

testGetProfile()