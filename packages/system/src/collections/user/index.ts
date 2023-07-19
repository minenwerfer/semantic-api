import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, User } from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import ping from './ping'

export { schemaCallback as userSchemaCallback } from './model'

export default defineCollection(async () => ({
  item: User,
  description,
  model,
  functions: {
    ...useFunctions<typeof User, typeof description>()([
      'get',
      'getAll',
      'remove',
      'upload',
      'removeFile'
    ]),
    insert,
    authenticate,
    ping,
  }
}))
