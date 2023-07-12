import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters, Projection } from './types'
import { LEAN_OPTIONS } from '../constants'

export const get = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: {
  filters?: Filters<TDocument>,
  project?: Projection<TDocument>
}, context: Context<TDescription, Collections, Algorithms>) => {
  return context.model.findOne(
    payload.filters,
    payload.project
  ).lean(LEAN_OPTIONS) as Promise<TDocument>
}
