import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const remove = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: {
  filters: Filters<TDocument>
}, context: Context<TDescription, Collections, Algorithms>) => {
  return context.model.findOneAndDelete(payload.filters, {
    strict: 'throw'
  })
}
