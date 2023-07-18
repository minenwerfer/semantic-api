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

const { getAll, insert } = useFunctions<typeof Person, typeof description>()

export default () => ({
  item: Person,
  description,
  functions: {
    getAll,
    insert
  },
})
