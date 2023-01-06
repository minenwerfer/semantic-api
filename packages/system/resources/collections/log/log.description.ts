import { makeDescription, Schema } from '../../../../api/core/collection'

export type Log = Schema<typeof schema>

const schema = {
  $id: 'log',
  owned: true,
  properties: {
    context: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    details: {
      type: 'object'
    },
    created_at: {
      type: 'string',
      format: 'date-time'
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  presets: [
    'view'
  ],
  filters: [
    'context',
    'message'
  ]
})
