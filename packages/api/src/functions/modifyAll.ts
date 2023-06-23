import type { MongoDocument } from '../types'
import type { Filters } from './types'

export const modifyAll = <T extends MongoDocument>() => (payload: {
  filters: Filters<T>,
  what: Partial<T>
}) => {
  return Promise.resolve(null)
}
