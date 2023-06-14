import { defineDescription, Schema } from '@semantic-api/api'

export type ResourceUsage = Schema<typeof schema>

const schema = {
  $id: 'resourceUsage',
  properties: {
    hits: {
      type: 'integer'
    },
    last_maximum_reach: {
      type: 'string',
      format: 'date-time'
    }
  }
} as const

export default defineDescription<typeof schema>(schema)
