
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

const mediaType = {
    id: '/mediaType',
    type: 'object',
    properties: {
        count: { type: 'integer', required: true },
        edges: { type: 'array', required: true },
    },
}

const schema = {
    type: 'object',
    properties: {
        graphql: {
            type: 'object',
            required: true,
            properties: {
                user: { 
                    type: 'object',
                    required: true,
                    properties: {
                        id: { type: 'string', required: true },
                        biography: { type: [ 'string', 'null' ], required: true },
                        external_url: { type: ['string', 'null'], required: true },
                        edge_followed_by: { $ref: '/countType', required: true },
                        edge_follow: { $ref: '/countType', required: true },
                        full_name: { type: [ 'string', 'null' ], required: true },
                        is_business_account: { type: 'boolean', required: true },
                        business_category_name: { type: [ 'string', 'null' ], required: true },
                        business_email: { type: [ 'string', 'null' ], required: true },
                        business_phone_number: { type: [ 'string', 'null' ], required: true },
                        business_address_json: { type: [ 'string', 'null' ], required: true },
                        is_private: { type: 'boolean', required: true },
                        is_verified: { type: 'boolean', required: true },
                        profile_pic_url: { type: 'string', required: true },
                        profile_pic_url_hd: { type: 'string', required: true },
                        username: { type: 'string', required: true },
                        edge_owner_to_timeline_media: { $ref: '/mediaType', required: true }
                    },
                }
            }
        },
    },
}

engine.addSchema(edgesType, '/edgesType')
engine.addSchema(countType, '/countType')
engine.addSchema(mediaType, '/mediaType')

const validate = (input) =>
    engine.validate(input, schema)

module.exports = validate