import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters, Projection } from './types'

export const get = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: {
  filters?: Filters<TDocument>,
  project?: Projection<TDocument>
}, context: Context<TDescription, Collections>) => {
  return context.model.findOne(
    payload.filters,
    payload.project
  ) as Promise<TDocument>
}
