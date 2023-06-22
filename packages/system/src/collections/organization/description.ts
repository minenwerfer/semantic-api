import { Schema, defineDescription } from '@semantic-api/api'

export type Organization = Schema<typeof schema>

const schema = <const>{
  $id: 'organization',
  owned: true,
  strict: true,
  indexes: [
    'name'
  ],
  properties: {
    name: {
      type: 'string'
    },
    members: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          roles: {
            type: 'array',
            items: {
              enum: [],
            }
          },
          user: {
            $ref: 'user'
          }
        }
      }
    }
  }
}

export default defineDescription(schema, {
  icon: 'building',
  presets: [
    'crud'
  ],
})
