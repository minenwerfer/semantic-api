import type { MongoDocument } from '../types'
import type { Projection } from './types'

export const insert = <T extends MongoDocument>() => (payload: {
  what: Partial<T>,
  project?: Projection<T>
}) => {
  return Promise.resolve({})
}
