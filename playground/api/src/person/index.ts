import { useFunctions } from '@semantic-api/api'
import description, { type Person } from './description'

const { getAll, insert } = useFunctions<Person, typeof description>()

export default () => ({
  item: {} as Person,
  description,
  functions: {
    getAll,
    insert
  },
})
