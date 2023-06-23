import type { Context, MongoDocument } from '../types'
import type { Filters, Projection, QuerySort } from './types'

export const getAll = <T extends MongoDocument>(context: any) => (payload: {
  filters?: Filters<T>
  project?: Projection<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
}) => {
  return Promise.resolve([{}])
}
