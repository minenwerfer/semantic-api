import type { Context, MongoDocument } from '../types'
import type { Projection } from './types'

export const insert = <T extends MongoDocument>(context: Context<T>) => (payload: {
  what: Partial<T>,
  project?: Projection<T>
}) => {
  return Promise.resolve({})
}
