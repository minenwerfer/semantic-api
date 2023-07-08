import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const _delete = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: {
  filters: Filters<TDocument>
}) => {
  return context.model.findOneAndDelete(payload.filters, {
    strict: 'throw'
  })
}
