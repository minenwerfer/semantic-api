import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type User } from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import ping from './ping'

const { get, getAll, delete: _delete, upload, deleteFile } = useFunctions<User, typeof description>()

export default defineCollection(async () => ({
  item: {} as User,
  description,
  model: model(),
  functions: {
    get,
    getAll,
    insert,
    delete: _delete,
    upload,
    deleteFile,
    authenticate,
    ping,
  }
}))
