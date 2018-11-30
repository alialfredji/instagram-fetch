
const { getPost } = require('../src')

const testGetPost = async () => {
    try {
        const data = await getPost(process.argv[2] || 'Bqx7o8dhETN')
        console.log(data)
    } catch (err) {
        throw err
    }
}

testGetPost()