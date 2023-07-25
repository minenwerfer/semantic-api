import { useFunctions } from '@semantic-api/api'
import { description, Log } from './description'

export default () => ({
  item: Log,
  description,
  functions: {
    ...useFunctions<typeof Log>()([
      'get',
      'getAll',
      'insert'
    ])
  }
})
