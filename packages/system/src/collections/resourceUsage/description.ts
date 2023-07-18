import { defineDescription } from '@semantic-api/api'

export const [ResourceUsage, description] = defineDescription({
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
})

