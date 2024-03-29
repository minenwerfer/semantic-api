import { defineDescription, useFunctions } from '@semantic-api/api'

const [Person, description] = defineDescription({
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

export default () => ({
  item: Person,
  description,
  functions: useFunctions<typeof Person>()([
    'getAll',
    'insert'
  ])
})
