import { makeDescription, Schema } from '../../../../api/core/collection'

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

export default makeDescription<typeof schema>(schema)
