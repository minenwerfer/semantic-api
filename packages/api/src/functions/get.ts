import type { MongoDocument } from '../types'
import type { Filters, Projection } from './types'

export const get = <T extends MongoDocument>() => (payload: {
  filters?: Filters<T>,
  project?: Projection<T>
}) => {
  return Promise.resolve({})
}
