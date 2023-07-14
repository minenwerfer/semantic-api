import { type Schema, defineSchema, defineDescription } from '@semantic-api/api'

export type Pet = Schema<typeof schema>

const schema = defineSchema({
  $id: 'pet',
  properties: {
    name: {
      type: 'string'
    },
    favorite_toy: {
      type: 'string'
    },
  }
})

export default defineDescription(schema)
