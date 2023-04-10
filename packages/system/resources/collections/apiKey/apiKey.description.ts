import { Schema, defineDescription } from '@semantic-api/api'

export type ApiKey = Schema<typeof schema>

const schema = {
  $id: 'apiKey',
  owned: true,
  strict: true,
  immutable: [
    'name',
    'content',
    'allowed_functions',
    'content'
  ],
  properties: {
    name: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    allowed_functions: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    active: {
      type: 'boolean'
    },
    created_at: {
      type: 'string',
      format: 'date-time',
      s$meta: true
    }
  }
} as const

export default defineDescription(schema, {
  icon: 'brackets-curly',
  presets: [
    'crud'
  ],
  table: [
    'name',
    'allowed_functions',
    'active',
    'created_at'
  ],
  form: [
    'name',
    'allowed_functions'
  ],
  actions: {
    'route/dashboard-documentation': {
      name: 'Documentação',
      icon: 'file-alt'
    }
  },
  individualActions: {
    copyContent: {
      name: 'Copiar chave',
      icon: 'copy'
    }
  }
})
