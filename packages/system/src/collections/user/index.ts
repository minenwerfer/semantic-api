import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, User } from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import ping from './ping'

const { get, getAll, delete: _delete, upload, deleteFile } = useFunctions<typeof User, typeof description>()

export default defineCollection(async () => ({
  item: User,
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
