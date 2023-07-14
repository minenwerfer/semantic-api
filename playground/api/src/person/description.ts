import { type Schema, defineSchema, defineDescription } from '@semantic-api/api'

export type Person = Schema<typeof schema>

const schema = defineSchema({
  $id: 'person',
  properties: {
    name: {
      type: 'string'
    },
    job: {
      enum: [
        'driver',
        'baker',
        'programmer',
        'policeman'
      ]
    }
  }
})

export default defineDescription(schema)
