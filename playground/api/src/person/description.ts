import { defineDescription } from '@semantic-api/api'

export const [Person, description] = defineDescription({
  $id: 'person',
  required: [],
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
