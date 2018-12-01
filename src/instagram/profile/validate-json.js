
const Validator = require('jsonschema').Validator
const engine = new Validator()

const edgesType = {
    id: '/edgesType',
    type: 'object',
    required: ['edges'],
    properties: {
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
                user: { 
                    type: 'object',
                    required: true,
                    properties: {},
                }
            }
        },
    },
}

engine.addSchema(edgesType, '/edgesType')

const validate = (input) =>
    engine.validate(input, schema)

module.exports = validate