import type { MongoDocument } from '../types'
import type { Filters, Projection, QuerySort } from './types'

export const getAll = <T extends MongoDocument>(payload: {
  filters?: Filters<T>
  project?: Projection<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
}) => {
  return Promise.resolve([{}])
}
