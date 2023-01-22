import { makeDescription, Schema } from '../../../../api/core/collection'

export type ResourceUsage = Schema<typeof schema>

const schema = {
  $id: 'resourceUsage',
  properties: {
    scale: {
      type: 'integer'
    },
    limit: {
      type: 'integer'
    },
  }
} as const

export default makeDescription<typeof schema>(schema)
