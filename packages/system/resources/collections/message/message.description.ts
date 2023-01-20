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
      type: 'string',
      s$element: 'textarea'
    },
    seen_by: {
      type: 'array',
      items: {
        $ref: 'user'
      }
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
