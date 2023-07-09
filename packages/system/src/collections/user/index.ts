import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type User } from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import ping from './ping'

const { get, getAll } = useFunctions<User, typeof description>()

export default defineCollection(async () => ({
  description,
  item: {} as User,
  model: model(),
  functions: {
    authenticate,
    insert,
    get,
    getAll,
    ping
  }
}))
