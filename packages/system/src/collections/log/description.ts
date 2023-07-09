import { defineDescription, Schema } from '@semantic-api/api'

export type Log = Schema<typeof schema>

const schema = <const>{
  $id: 'log',
  properties: {
    owner: {
      // don't use "owned: true", we want it this way
      $ref: 'user'
    },
    context: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    details: {
      type: 'object'
    },
    created_at: {
      type: 'string',
      format: 'date-time'
    }
  }
}

export default defineDescription(schema, {
  icon: 'search-alt',
  presets: [
    'view'
  ],
  filters: [
    'context',
    'message',
    'owner'
  ]
})
