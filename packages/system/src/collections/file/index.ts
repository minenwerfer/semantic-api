import { defineCollection } from '@semantic-api/api'
import description, { type File } from './description'
import insert from './insert'
import download from './download'
import _delete from './delete'

export default defineCollection(() => ({
  description,
  item: {} as File,
  functions: {
    insert,
    download,
    delete: _delete
  }
}))
