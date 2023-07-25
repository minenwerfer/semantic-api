import { useFunctions } from '@semantic-api/api'
import { description, ApiKey } from './description'
import insert from './insert'

export default () => ({
  item: ApiKey,
  description,
  functions: {
    ...useFunctions<ApiKey>()([
      'getAll'
    ]),
    insert,
  }
})
