import { defineDescription, Schema } from '@semantic-api/api'

export type ResourceUsage = Schema<typeof schema>

const schema = <const>{
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
}

export default defineDescription(schema)
