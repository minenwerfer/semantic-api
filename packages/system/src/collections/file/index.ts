import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, File } from './description'
import model from './model'
import insert from './insert'
import download from './download'
import remove from './remove'

export default defineCollection(() => ({
  item: File,
  description,
  model: model(),
  functions: {
    ...useFunctions<typeof File, typeof description>()([
      'get'
    ]),
    insert,
    download,
    remove
  }
}))
