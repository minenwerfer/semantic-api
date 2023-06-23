import type { MongoDocument } from '../types'
import type { Filters } from './types'

export const count = <T extends MongoDocument>() => (payload: { filters?: Filters<T> }) => {
  return Promise.resolve(1)
}
