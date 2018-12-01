
const Validator = require('jsonschema').Validator
const engine = new Validator()

const edgesType = {
    id: '/edgesType',
    type: 'object',
    properties: {
        edges: { type: 'array', required: true },
    },
}

const countType = {
    id: '/countType',
    type: 'object',
    properties: {
        count: { type: 'integer', required: true }
    },
}

const locationType = {
    id: '/locationType',
    type: [ 'object', 'null' ],
    properties: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        slug: { type: 'string', required: true }
    },
}

const ownerType = {
    id: '/ownerType',
    type: 'object',
    properties: {
        id: { type: 'string', required: true },
        username: { type: 'string', required: true }
    },
}

const schema = {
    type: 'object',
    properties: {
        node: {
            type: 'object',
            required: true,
            properties: {
                id: { type: 'string', required: true },
                shortcode: { type: 'string', required: true },
                edge_media_to_caption: { $ref: '/edgesType', required: true },
                edge_media_to_comment: { $ref: '/countType', required: true },
                taken_at_timestamp: { type: 'integer', required: true },
                display_url: { type: 'string', required: true },
                edge_liked_by: { $ref: '/countType', required: true },
                edge_media_preview_like: { $ref: '/countType', required: true },
                location: { $ref: '/locationType', required: true },
                owner: { $ref: '/ownerType', required: true },
                thumbnail_src: { type: 'string', required: true },
                thumbnail_resources: { type: 'array', required: true },
                is_video: { type: 'boolean', required: true },
                video_view_count: { type: 'integer', required: false },
            },
        },
    },
}

engine.addSchema(edgesType, '/edgesType')
engine.addSchema(countType, '/countType')
engine.addSchema(locationType, '/locationType')
engine.addSchema(ownerType, '/ownerType')

const validate = (input) =>
    engine.validate(input, schema)

module.exports = validate