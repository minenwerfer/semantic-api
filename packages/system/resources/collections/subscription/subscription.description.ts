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
        $ref: 'message'
      },
      s$maxDepth: 4
    },
  }
} as const

export default makeDescription<typeof schema>(schema)
