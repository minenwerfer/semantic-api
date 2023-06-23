import { defineDescription, Schema } from '@semantic-api/api'

export type Pet = Schema<typeof schema>

const schema = <const>{
  $id: 'pet',
  properties: {
    name: {
      type: 'string'
    },
    favorite_toy: {
      type: 'string'
    }
  }
}

export default defineDescription(schema)
