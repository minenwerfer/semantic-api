import { makeDescription, Schema } from '../../../../api/core/collection'

export type Subscription = Schema<typeof schema>

const schema = {
  $id: 'subscription',
  owned: true,
  properties: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    identifier: {
      type: 'string'
    },
    route: {
      type: 'string'
    },
    subscribers: {
      type: 'array',
      items: {
        $ref: 'user'
      }
    },
    messages: {
      type: 'array',
      items: {
        $ref: 'subscriptionMessage'
      },
      s$maxDepth: 4
    },
    was_viewed: {
      type: 'boolean',
      s$meta: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
