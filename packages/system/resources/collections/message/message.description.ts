import { makeDescription, Schema } from '../../../../api/core/collection'

export type Message = Schema<typeof schema>

const schema = {
  $id: 'message',
  owned: true,
  indexes: [
    'title'
  ],
  properties: {
    title: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
  }
} as const

export default makeDescription<typeof schema>(schema)
