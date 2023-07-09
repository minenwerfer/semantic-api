import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { Person } from './description'

const { getAll } = useFunctions<Person, typeof description>()

export default defineCollection(() => ({
  item: {} as Person,
  description,
  functions: {
    getAll
  },
}))
