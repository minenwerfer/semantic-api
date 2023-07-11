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
  const {
    filters = {},
    project = {}
  } = payload || {}

  return context.model.find(
    filters as any,
    project
  ) as Promise<Array<TDocument>>
}
