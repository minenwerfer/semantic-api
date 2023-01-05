import { makeDescription, Schema } from '../../../api/core/collection'

export type Report = Schema<typeof schema>

const schema = {
  $id: 'report',
  owned: true,
  properties: {
    _collection: {
      type: 'string',
      s$translate: true
    },
    created_at: {
      type: 'string',
      format: 'date-time',
      s$meta: true
    },
    file: {
      $ref: 'file',
      s$noform: true
    },
    format: {
      enum: [
        'csv',
        'pdf'
      ],
      s$element: 'select'
    },
    type: {
      enum: [
        'filtered_only',
        'everything'
      ],
      s$element: 'radio',
      s$translate: true
    },
    limit: {
      type: 'number',
      s$hint: 'Relatórios com muitas entradas são custosos em termos de processamento, portanto utilize essa opção com cuidado. Verifique antes se já não há um relatório pronto na seção "Relatórios" antes de prosseguir.',
    },
    offset: {
      type: 'number',
      s$hint: 'Deixe vazio para retornar do princípio',
    },
    filters: {
      type: 'object',
      s$noform: true
    },
    entries_count: {
      type: 'number',
      s$noform: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  icon: 'bag-alt',
  presets: [
    'deleteAll'
  ],
  individualActions: {
    download: {
      name: 'Baixar',
      icon: 'cloud-download'
    },
    delete: {
      name: 'Remover',
      icon: 'trash-alt',
      ask: true
    }
  },
})
