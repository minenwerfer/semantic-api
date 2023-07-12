import { defineCollection } from '@semantic-api/api'
import description, { type File } from './description'
import model from './model'
import insert from './insert'
import download from './download'
import _delete from './delete'

export default defineCollection(() => ({
  item: {} as File,
  description,
  model: model(),
  functions: {
    insert,
    download,
    delete: _delete
  }
}))
