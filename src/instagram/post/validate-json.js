
const Validator = require('jsonschema').Validator
const engine = new Validator()

const ownerType = {
    id: '/ownerType',
    type: 'object',
    properties: {
        id: { type: 'string', required: true },
        profile_pic_url: { type: 'string', required: true },
        username: { type: 'string', required: true },
        full_name: { type: 'string', required: true },
        is_private: { type: 'boolean', required: true },
        is_verified: { type: 'boolean', required: true },
    },
}

const locationType = {
    id: '/locationType',
    type: [ 'object', 'null' ],
    required: ['name'],
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
        address_json: { type: 'string' },
    },
}

// contain array

const edgesType = {
    id: '/edgesType',
    type: 'object',
    required: ['edges'],
    properties: {
        edges: { type: 'array' },
    },
}

const commentsType = {
    id: '/commentsType',
    type: 'object',
    required: [ 'edges', 'count' ],
    properties: {
        count: { type: 'integer' },
        edges: { type: 'array' },
    },
}

const likesType = {
    id: '/likesType',
    type: 'object',
    required: [ 'edges', 'count' ],
    properties: {
        count: { type: 'integer' },
        edges: { type: 'array' },
    },
}

const schema = {
    type: 'object',
    properties: {
        graphql: {
            type: 'object',
            required: true,
            properties: {
                shortcode_media: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', required: true },
                        shortcode: { type: 'string', required: true },
                        display_url: { type: 'string', required: true },
                        is_video: { type: 'boolean', required: true },
                        video_view_count: { type: 'number', required: false },
                        video_url: { type: 'string', required: false },
                        display_resources: { type: 'array', required: true },
                        owner: { $ref: '/ownerType', required: true },
                        edge_media_to_tagged_user: { $ref: '/edgesType', required: true },
                        edge_media_to_caption: { $ref: '/edgesType', required: true },
                        edge_media_to_comment: { $ref: '/commentsType', required: true },
                        taken_at_timestamp: { type: 'integer', required: true },
                        edge_media_preview_like: { $ref: '/likesType', required: true },
                        edge_media_to_sponsor_user: { $ref: '/edgesType', required: true },
                        location: { $ref: '/locationType', required: true },
                        is_ad: { type: 'boolean', required: false },
                        edge_web_media_to_related_media: { $ref: '/edgesType', required: true },
                    },
                }
            }
        },
    },
}

engine.addSchema(edgesType, '/edgesType')
engine.addSchema(ownerType, '/ownerType')
engine.addSchema(commentsType, '/commentsType')
engine.addSchema(likesType, '/likesType')
engine.addSchema(locationType, '/locationType')

const validate = (input) =>
    engine.validate(input, schema)

module.exports = validate