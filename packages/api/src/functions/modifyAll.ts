import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const modifyAll = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: {
  filters: Filters<TDocument>,
  what: Partial<TDocument>
}) => {
  return Promise.resolve(null)
}
