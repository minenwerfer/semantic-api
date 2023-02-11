import { makeDescription, Schema } from '../../../../api/core/collection'

export type SubscriptionMessage = Schema<typeof schema>

const schema = {
  $id: 'subscriptionMessage',
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
    viewers: {
      type: 'array',
      items: {
        $ref: 'user'
      }
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
