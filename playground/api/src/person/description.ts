import { defineDescription } from '@semantic-api/api'

export const [Person, description] = defineDescription({
  $id: 'person',
  properties: {
    name: {
      type: 'string'
    },
    job: {
      enum: [
        'driver',
        'baker',
        'programmer',
        'policeman'
      ]
    }
  }
})
