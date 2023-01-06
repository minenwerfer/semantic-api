import { makeDescription, Schema } from '../../../../api/core/collection'

export type Notification = Schema<typeof schema>

const schema = {
  $id: 'notification',
  owned: true,
  required: [
    'title'
  ],
  properties: {
    destination: {
      type: 'array',
      items: {
        $ref: 'user'
      }
    },
    title: {
      type: 'string',
    },
    action: {
      type: 'string'
    },
    groups: {
      type: 'string',
    },
    subject: {
      type: 'string'
    },
    content: {
      type: 'string',
      s$element: 'textarea',
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  presets: [
    'crud'
  ],
})
