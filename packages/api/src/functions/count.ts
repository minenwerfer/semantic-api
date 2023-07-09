import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const count = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => async (payload: { filters?: Filters<TDocument> }, context: Context<TDescription, Collections, Algorithms>) => {
  return context.model.countDocuments(payload.filters)
}
