import { useFunctions } from '@semantic-api/api'
import { description, User } from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import createAccount from './createAccount'
import ping from './ping'

export { schemaCallback as userSchemaCallback } from './model'

export default async () => ({
  item: User,
  description,
  model,
  functions: {
    ...useFunctions<typeof User>()([
      'get',
      'getAll',
      'remove',
      'upload',
      'removeFile'
    ]),
    insert,
    createAccount,
    authenticate,
    ping,
  }
})
