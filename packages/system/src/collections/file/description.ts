import { defineDescription, Schema } from '@semantic-api/api'

export type File = Schema<typeof schema>

const schema = <const>{
  $id: 'file',
  owned: true,
  alwaysOwned: true,
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
      type: 'string',
      s$hidden: true
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
}

export default defineDescription(schema, {
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
