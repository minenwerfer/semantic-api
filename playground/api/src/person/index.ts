import { useFunctions } from '@semantic-api/api'
import { description, type Person } from './description'

const { getAll, insert } = useFunctions<typeof Person, typeof description>()

export default () => ({
  item: {} as typeof Person,
  description,
  functions: {
    getAll,
    insert
  },
})
