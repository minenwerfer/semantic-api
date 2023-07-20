import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, ApiKey } from './description'
import insert from './insert'

export default defineCollection(() => ({
  item: ApiKey,
  description,
  functions: {
    ...useFunctions<ApiKey>()([
      'getAll'
    ]),
    insert,
  }
}))
