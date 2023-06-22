import { Schema, defineDescription } from '@semantic-api/api'

export type ApiKey = Schema<typeof schema>

const schema = <const>{
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
}

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
  individualActions: {
    copyContent: {
      name: 'Copiar chave',
      icon: 'copy'
    }
  }
})
