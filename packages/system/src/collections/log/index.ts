import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type Log } from './description'

const { get, getAll, insert } = useFunctions<Log, typeof description>()

export default defineCollection(() => ({
  item: {} as Log,
  description,
  functions: {
    get,
    getAll,
    insert
  }
}))
