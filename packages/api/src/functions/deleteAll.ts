import type { MongoDocument } from '../types'
import type { Filters } from './types'

export const deleteAll = <T extends MongoDocument>(payload: {
  filters?: Filters<T>
}) => {
  return Promise.resolve(null)
}
