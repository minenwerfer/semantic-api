import { defineCollection, useFunctions } from '@semantic-api/api'
import description, { type Log } from './description'

const { getAll, insert } = useFunctions<Log, typeof description>()

export default defineCollection(() => ({
  description,
  item: {} as Log,
  functions: {
    getAll,
    insert
  }
}))
