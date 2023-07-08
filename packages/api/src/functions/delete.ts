import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const _delete = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: {
  filters: Filters<TDocument>
}, context: Context<TDescription, Collections>) => {
  return context.model.findOneAndDelete(payload.filters, {
    strict: 'throw'
  })
}
