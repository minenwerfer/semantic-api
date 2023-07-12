import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type File } from './description'
import model from './model'
import insert from './insert'
import download from './download'
import _delete from './delete'

const { get } = useFunctions<File, typeof description>()

export default defineCollection(() => ({
  item: {} as File,
  description,
  model: model(),
  functions: {
    get,
    insert,
    download,
    delete: _delete
  }
}))
