import { defineCollection, useFunctions } from '@semantic-api/api'
import { description, Log } from './description'

const { get, getAll, insert } = useFunctions<typeof Log, typeof description>()

export default defineCollection(() => ({
  item: Log,
  description,
  functions: {
    get,
    getAll,
    insert
  }
}))
