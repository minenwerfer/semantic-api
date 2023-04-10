import { defineDescription, Schema, Reference } from '@semantic-api/api'

export type User = Omit<Schema<typeof schema>, 'roles'> & {
  roles: Array<string>
  testPassword?(password: string): boolean
  owner: Reference
}

const schema = {
  $id: 'user',
  required: [
    'full_name',
    'roles',
    'email'
  ],
  form: [
    'full_name',
    'active',
    'roles',
    'email',
    'phone',
    'picture'
  ],
  indexes: [
    'full_name'
  ],
  properties: {
    full_name: {
      type: 'string'
    },
    first_name: {
      type: 'string',
      s$meta: true
    },
    last_name: {
      type: 'string',
      s$meta: true
    },
    active: {
      type: 'boolean',
      default: true
    },
    roles: {
      type: 'array',
      items: {
        enum: [],
      },
      s$element: 'select'
    },
    email: {
      type: 'string',
      s$inputType: 'email',
      s$unique: true,
    },
    password: {
      type: 'string',
      s$inputType: 'password',
      s$hidden: true,
    },
    phone: {
      type: 'string',
      s$mask: '(##) #####-####'
    },
    picture: {
      $ref: 'file',
      accept: [
        'image/*',
      ]
    },
    group: {
      type: 'string',
    },
    self_registered: {
      type: 'boolean',
      readOnly: true
    },
    wizard_versions: {
      type: 'array',
      items: {
        type: 'string'
      },
    },
    resources_usage: {
      type: 'object',
      additionalProperties: {
        $ref: 'resourceUsage'
      },
      s$inline: true
    },
    updated_at: {
      type: 'string',
      format: 'date-time',
      s$meta: true
    },
  }
} as const

export default defineDescription<typeof schema>(schema, {
  presets: [
    'crud',
    'view',
    'duplicate'
  ],
  layout: {
    name: 'grid',
    options: {
      title: 'full_name',
      picture: 'picture'
    }
  },
  individualActions: {
    'ui/spawnEdit': {
      name: 'Editar',
      icon: 'edit',
    },
    'ui/spawnExtra': {
      name: 'Editar detalhes',
      icon: 'edit'
    },
    'route/dashboard-user-changepass': {
      name: 'Mudar senha',
      icon: 'key-skeleton',
      fetchItem: true
    },
    delete: {
      name: 'Remover',
      icon: 'trash-alt',
      ask: true
    }
  },
  searchable: {
    picture: 'picture',
    indexes: [
      'name',
      'phone',
      'email'
    ]
  },
  filters: [
    'full_name',
    'roles',
    'email',
    'phone'
  ],
  table: [
    'full_name',
    'roles',
    'picture',
    'active',
    'updated_at'
  ],
  tableMeta: [
    'first_name',
    'last_name'
  ],
  formLayout: {
    first_name: {
      span: 3,
    },
    last_name: {
      span: 3
    }
  }
})
