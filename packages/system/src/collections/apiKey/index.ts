import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type ApiKey } from './description'
import insert from './insert'

const { getAll } = useFunctions<ApiKey, typeof description>()

export default defineCollection(() => ({
  item: {} as ApiKey,
  description,
  functions: {
    insert,
    getAll
  }
}))
