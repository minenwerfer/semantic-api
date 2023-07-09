import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters, Projection, QuerySort } from './types'

export const getAll = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: {
  filters?: Filters<TDocument>
  project?: Projection<TDocument>
  offset?: number
  limit?: number
  sort?: QuerySort<TDocument>
}, context: Context<TDescription, Collections, Algorithms>) => {
  return context.model.find(
    payload.filters as any,
    payload.project
  ) as Promise<Array<TDocument>>
}
