import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, File } from './description'
import model from './model'
import insert from './insert'
import download from './download'
import _delete from './delete'

const { get } = useFunctions<typeof File, typeof description>()

export default defineCollection(() => ({
  item: File,
  description,
  model: model(),
  functions: {
    get,
    insert,
    download,
    delete: _delete
  }
}))
