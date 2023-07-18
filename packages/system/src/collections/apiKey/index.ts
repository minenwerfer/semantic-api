import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, ApiKey } from './description'
import insert from './insert'

const { getAll } = useFunctions<ApiKey, typeof description>()

export default defineCollection(() => ({
  item: ApiKey,
  description,
  functions: {
    insert,
    getAll
  }
}))
