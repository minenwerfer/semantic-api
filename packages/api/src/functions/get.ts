import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters, Projection } from './types'

export const get = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: {
  filters?: Filters<TDocument>,
  project?: Projection<TDocument>
}) => {
  return context.model.findOne(
    payload.filters,
    payload.project
  ) as Promise<TDocument>
}
