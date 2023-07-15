import { defineDescription } from '@semantic-api/api'

export const [Pet, description] = defineDescription({
  $id: 'pet',
  properties: {
    name: {
      type: 'string'
    },
    favorite_toy: {
      type: 'string'
    },
  }
})
