import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const count = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => async (payload: { filters?: Filters<TDocument> }) => {
  return context.model.countDocuments(payload.filters)
}
