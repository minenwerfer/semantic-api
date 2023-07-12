import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type Organization } from './description'

const { getAll } = useFunctions<Organization, typeof description>()

export default defineCollection(() => ({
  item: {} as Organization,
  description,
  functions: {
    getAll
  }
}))
