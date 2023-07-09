import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type ApiKey } from './description'
import insert from './insert'

const { getAll } = useFunctions<ApiKey, typeof description>()

export default defineCollection(() => ({
  description,
  item: {} as ApiKey,
  functions: {
    insert,
    getAll
  }
}))
