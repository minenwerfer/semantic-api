import { makeDescription, Schema } from '../../../api/core/collection'

export type File = Schema<typeof schema>

const schema = {
  $id: 'file',
  owned: true,
  presets: [
    'owned'
  ],
  required: [
    'size',
    'last_modified',
    'filename',
    'mime'
  ],
  indexes: [
    'filename',
    'link'
  ],
  properties: {
    mime: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    last_modified: {
      type: 'string',
      format: 'date-time'
    },
    filename: {
      type: 'string',
    },
    absolute_path: {
      type: 'string'
    },
    relative_path: {
      type: 'string'
    },
    immutable: {
      type: 'boolean'
    },
    link: {
      type: 'string',
      s$meta: true
    },
    download_link: {
      type: 'string',
      s$meta: true
    }
  },
} as const

export default makeDescription<typeof schema>(schema, {
  actions: {
    deleteAll: {
      name: 'Remover',
      ask: true,
      selection: true
    }
  },
  individualActions: {
    remove: {
      name: 'Remover',
      icon: 'trash-alt',
      ask: true
    }
  },
})
