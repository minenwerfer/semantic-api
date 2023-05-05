import { makeDescription, Schema } from '@semantic-api/api'

export type Person = Schema<typeof schema>

const schema = {
  $id: 'person',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'number'
    },
    job: {
      enum: [
        'aviator',
        'doctor',
        'programmer'
      ]
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
