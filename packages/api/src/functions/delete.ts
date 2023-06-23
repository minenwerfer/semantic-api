import type { MongoDocument } from '../types'
import type { Filters } from './types'

export const _delete = <T extends MongoDocument>() => (payload: {
  filters: Filters<T>
}) => {
  return Promise.resolve({})
}
