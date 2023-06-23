import { defineDescription, Schema } from '@semantic-api/api'

export type Person = Schema<typeof schema>

const schema = <const>{
  $id: 'person',
  properties: {
    name: {
      type: 'string'
    }
  }
}

export default defineDescription(schema)
