import { useFunctions } from '@semantic-api/api'
import { description, Person } from './description'

const { getAll, insert } = useFunctions<typeof Person, typeof description>()

export default () => ({
  item: Person,
  description,
  functions: {
    getAll,
    insert
  },
})
